import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserConversation } from '../../../model/user-conversation.model';
import { Users } from 'src/app/model/users';
import { getEventCardDefaultImage, timeAgo } from 'src/app/shared/utility/utility';
import { AlertController, AlertOptions, ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { EventMessage } from 'src/app/model/events.model';
import { SupportTicket, SupportTicketMessage } from 'src/app/model/support-ticket.model';
import { catchError, Observable, of, Subject, takeUntil } from 'rxjs';
import { EventMessageService } from 'src/app/services/event-message.service';
import * as uuid from 'uuid';
import { ApiResponse } from 'src/app/model/api-response.model';
import { FormControl } from '@angular/forms';
import { AnimationService } from 'src/app/services/animation.service';
import { EventDetailsComponent } from 'src/app/shared/event-details/event-details.component';
import { filter } from 'rxjs/operators';
import { UserConversationService } from 'src/app/services/user-conversation.service';
import { StorageService } from 'src/app/services/storage.service';
import { SupportTicketService } from 'src/app/services/support-ticket.service';
import { SupportTicketDetailsComponent } from 'src/app/shared/support-ticket-details/support-ticket-details.component';
import { Style } from '@capacitor/status-bar';
import { StatusBarService } from 'src/app/services/status-bar.service';
import { OneSignalNotificationService } from 'src/app/services/one-signal-notification.service';


@Component({
  selector: 'app-message-details',
  templateUrl: './message-details.page.html',
  styleUrls: ['./message-details.page.scss'],
})
export class MessageDetailsPage implements OnInit {
  userConversation: UserConversation;
  modal: HTMLIonModalElement;
  currentUser: Users;
  type: "EVENTS" | "SUPPORT_TICKET";
  eventMessages: EventMessage[] = [];
  supportTicketMessages: SupportTicketMessage[] = [];
  pageIndex = 0;
  pageSize = 10;
  total = 0;
  isLoading = false;
  error: any;
  messageControl = new FormControl();
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  refererPage: "MESSAGES" | "EVENT_DETAILS" | "EVENT_NOTIF" | "SUPPORT_DETAILS";
  @ViewChild('messageList') private messageList: ElementRef<HTMLDivElement>;
  constructor(
    private alertController: AlertController,
    private eventMessageService: EventMessageService,
    private supportTicketService: SupportTicketService,
    private toastController: ToastController,
    private animationService: AnimationService,
    private storageService: StorageService,
    private statusBarService: StatusBarService, 
    private modalCtrl: ModalController,
    private userConversationService: UserConversationService,
    private oneSignalNotificationService: OneSignalNotificationService,
  ) {
    this.oneSignalNotificationService.data$.subscribe(async (res: { type: 'EVENTS' | 'SUPPORT_TICKET' | 'MESSAGE' })=> {
      
      this.pageIndex = 0;
      this.pageSize = 10;
      if(res.type === "EVENTS" || res.type === "MESSAGE") {
        await Promise.all([
          this.initEventMessage(),
          this.markAsRead()
        ]).then(res=> {
          this.messageList.nativeElement.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes the scroll smooth; remove it for an instant scroll
          })
        })
      } else {
        await Promise.all([
          this.initSupportTicketMessage(),
          this.markAsRead()
        ]).then(res=> {
          this.messageList.nativeElement.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes the scroll smooth; remove it for an instant scroll
          })
        })
      }
    })
     }

  ngOnInit() {
  }

  async ngAfterViewInit(): Promise<void> {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.pageIndex = 0;
    this.pageSize = 10;
    this.total = 0;
    this.eventMessages = [];
    this.supportTicketMessages = [];
    if(this.type === "EVENTS") {
      await Promise.all([
        this.initEventMessage(),
        this.markAsRead()
      ])
    } else {
      await Promise.all([
        this.initSupportTicketMessage(),
        this.markAsRead()
      ])
    }
  }

  async onScroll() {
    const element = this.messageList.nativeElement;
    // Check if the user has scrolled to the "top" in column-reverse layout
    const isScrolledToBottom = (element.scrollTop > 0 ? element.scrollTop : element.scrollTop*-1) + element.clientHeight >= element.scrollHeight;

    const allMesageDisplayed = this.eventMessages.length >= this.total;
    if (isScrolledToBottom && !this.isLoading && !allMesageDisplayed) {
      this.pageIndex = this.pageIndex + 1;
      if(this.type === "EVENTS") {
        this.initEventMessage();
      } else {
        this.initSupportTicketMessage();
      }
    }
  }

  async initEventMessage() {
    try{
      const filter = [{
          apiNotation: "event.eventCode",
          filter: this.userConversation?.referenceId,
          type: "precise"
        } as any,{
          apiNotation: "fromUser.userId",
          filter: [this.userConversation?.fromUser?.userId, this.userConversation?.toUser?.userId],
          type: "in"
        },{
          apiNotation: "toUser.userId",
          filter: [this.userConversation?.fromUser?.userId, this.userConversation?.toUser?.userId],
          type: "in"
        }
      ]

      this.isLoading = true;
      const res = await this.eventMessageService.getByAdvanceSearch({
        order: { dateTimeSent: "DESC"},
        columnDef: filter,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(this.handleError('support-ticket-message', []))
      ).toPromise();
      
      if(res.success){
        this.eventMessages = [
          ...this.eventMessages,
          ...res.data.results.filter((data: EventMessage) =>
            !this.eventMessages.some((message) => message.eventMessageId === data.eventMessageId)
          ),
        ];
        this.total = res.data.total;
        setTimeout(()=> {
          this.isLoading = false;
        }, 1000);
      }
      else{
        this.error = Array.isArray(res.message) ? res.message[0] : res.message;
        this.isLoading = false;
        this.presentToast({
          duration: 15000,
          position: "top",
          message: this.error,
          cssClass: 'alert-danger',
          buttons: ['OK'],
        });
      }
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.isLoading = false;
      this.presentToast({
        duration: 15000,
        position: "top",
        message: this.error,
        cssClass: 'alert-danger',
        buttons: ['OK'],
      });
    }
  }

  async markAsRead() {
    try {
      if(this.userConversation && this.userConversation?.userConversationId) {
        const res = await this.userConversationService.marAsRead(this.userConversation?.userConversationId).pipe(
          takeUntil(this.ngUnsubscribe),
          catchError(this.handleError('user-conversation', []))
        ).toPromise();
        this.storageService.saveTotalUnreadNotif(res.data.totalUnreadNotif);
      }
    } catch(ex) {

    }
  }

  async postEventMessage(message: string) {
    try{
      const tempId = uuid.v4();
      this.eventMessages = [
        {
          eventMessageId: tempId,
          message: message,
          toUser: this.userConversation?.toUser,
          fromUser: this.userConversation?.fromUser
        },
        ...this.eventMessages
      ];
      this.messageControl.setValue(null);
      this.isLoading = true;
      await this.eventMessageService.postMessage({
        eventCode: this.userConversation?.referenceId,
        message ,
        fromUserCode: this.userConversation?.fromUser?.userCode,
        toUserCode: this.userConversation?.toUser?.userCode,
      }).pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(this.handleError('event-message', []))
      )
      .subscribe(async (res: ApiResponse<EventMessage>) => {
        if(res.success){
          if(this.eventMessages.some(x=>x.eventMessageId === tempId)) {
            this.eventMessages.find(x=>x.eventMessageId === tempId).status = res.data.status;
            this.eventMessages.find(x=>x.eventMessageId === tempId).eventMessageId = res.data.eventMessageId;
          }
          this.isLoading = false;
        }
        else{
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.isLoading = false;
          this.presentToast({
            duration: 15000,
            position: "top",
            message: this.error,
            cssClass: 'alert-danger',
            buttons: ['OK'],
          });
        }
      }, async (err) => {
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.isLoading = false;
        this.presentToast({
          duration: 15000,
          position: "top",
          message: this.error,
          cssClass: 'alert-danger',
          buttons: ['OK'],
        });
      });
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.isLoading = false;
      this.presentToast({
        duration: 15000,
        position: "top",
        message: this.error,
        cssClass: 'alert-danger',
        buttons: ['OK'],
      });
    }
  }

  async initSupportTicketMessage() {
    try{
      const filter = [{
          apiNotation: "supportTicket.supportTicketCode",
          filter: this.userConversation?.referenceId,
          type: "precise"
        }
      ]

      this.isLoading = true;
      const res = await this.supportTicketService.getMessageByAdvanceSearch({
        order: { dateTimeSent: "DESC"},
        columnDef: filter,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(this.handleError('support-ticket-message', []))
      ).toPromise();
      
      if(res.success){
        this.supportTicketMessages = [
          ...this.supportTicketMessages,
          ...res.data.results.filter((data: SupportTicketMessage) =>
            !this.supportTicketMessages.some((message) => message.supportTicketMessageId === data.supportTicketMessageId)
          ),
        ];
        this.total = res.data.total;
        setTimeout(()=> {
          this.isLoading = false;
        }, 1000);
      }
      else{
        this.error = Array.isArray(res.message) ? res.message[0] : res.message;
        this.isLoading = false;
        this.presentToast({
          duration: 15000,
          position: "top",
          message: this.error,
          cssClass: 'alert-danger',
          buttons: ['OK'],
        });
      }
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.isLoading = false;
      this.presentToast({
        duration: 15000,
        position: "top",
        message: this.error,
        cssClass: 'alert-danger',
        buttons: ['OK'],
      });
    }
  }

  async postSupportTicketMessage(message: string) {
    try{
      const tempId = uuid.v4();
      this.supportTicketMessages = [
        {
          supportTicketMessageId: tempId,
          message: message,
          fromUser: this.currentUser
        },
        ...this.supportTicketMessages
      ];
      this.messageControl.setValue(null);
      this.isLoading = true;
      await this.supportTicketService.postMessage({
        supportTicketCode: this.userConversation?.referenceId && this.userConversation?.referenceId !== '' ?  this.userConversation?.referenceId : this.userConversation?.supportTicket?.supportTicketCode,
        message ,
        userCode: this.currentUser?.userCode,
      }).pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(this.handleError('support-ticket-message', []))
      )
      .subscribe(async (res: ApiResponse<EventMessage>) => {
        if(res.success){
          this.isLoading = false;
        }
        else{
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.isLoading = false;
          this.presentToast({
            duration: 15000,
            position: "top",
            message: this.error,
            cssClass: 'alert-danger',
            buttons: ['OK'],
          });
        }
      }, async (err) => {
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.isLoading = false;
        this.presentToast({
          duration: 15000,
          position: "top",
          message: this.error,
          cssClass: 'alert-danger',
          buttons: ['OK'],
        });
      });
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.isLoading = false;
      this.presentToast({
        duration: 15000,
        position: "top",
        message: this.error,
        cssClass: 'alert-danger',
        buttons: ['OK'],
      });
    }
  }

  async onOpenInfo() {
    this.close();
    if(this.userConversation.type === "EVENTS") {
      let modal: HTMLIonModalElement = null;
      modal = await this.modalCtrl.create({
        component: EventDetailsComponent,
        cssClass: 'modal-fullscreen',
        backdropDismiss: false,
        canDismiss: true,
        enterAnimation: this.animationService.pushLeftAnimation,
        leaveAnimation: this.animationService.leavePushLeftAnimation,
        componentProps: { modal, eventCode: this.userConversation?.referenceId },
      });
      modal.present();
      this.statusBarService.show();
      this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
      modal.onDidDismiss().then(res=> {
        this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
      });
    } else {
      let modal: HTMLIonModalElement = null;
      modal = await this.modalCtrl.create({
        component: SupportTicketDetailsComponent,
        cssClass: 'modal-fullscreen',
        backdropDismiss: false,
        canDismiss: true,
        enterAnimation: this.animationService.pushLeftAnimation,
        leaveAnimation: this.animationService.leavePushLeftAnimation,
        componentProps: { modal, supportTicket: this.userConversation?.supportTicket, },
      });
      modal.present();
      this.statusBarService.show();
      this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
      modal.onDidDismiss().then((res: {data: SupportTicket; role})=> {
        this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
      });
    }
  }

  async submit(message) {
    if(this.type === "EVENTS") {
      await this.postEventMessage(message);
    } else {
      await this.postSupportTicketMessage(message);
    }
  }

  getTimeAgo(date) {
    const time = timeAgo(date);
    return !isNaN(Number(time));
  }

  close() {
    this.modal.dismiss();
  }

  imageErrorHandler(event, type: "CHARITY" | "VOLUNTEER" | "DONATION" | "ASSISTANCE") {
    event.target.src = getEventCardDefaultImage(type);
  }

  async presentAlert(options: AlertOptions) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }

  async presentToast(options: ToastOptions) {
    const toast = await this.toastController.create({
      ...options,
      duration: 1500
    });

    await toast.present();
  }


  handleError<T>(operation = 'operation', result?: any) {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    return (error: any): Observable<any> => {
      return of(error.error as any);
    };
  }
}
function ngAfterViewInit() {
  throw new Error('Function not implemented.');
}

