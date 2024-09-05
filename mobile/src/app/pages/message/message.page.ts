import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { DeviceInfo } from '@capacitor/device';
import { Style } from '@capacitor/status-bar';
import { AlertController, IonRefresher, ModalController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { Events } from 'src/app/model/events.model';
import { UserConversation } from 'src/app/model/user-conversation.model';
import { Users } from 'src/app/model/users';
import { AnimationService } from 'src/app/services/animation.service';
import { PageLoaderService } from 'src/app/services/page-loader.service';
import { StatusBarService } from 'src/app/services/status-bar.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserConversationService } from 'src/app/services/user-conversation.service';
import { getEventCardDefaultImage } from 'src/app/shared/utility/utility';
import { environment } from 'src/environments/environment';
import { MessageDetailsPage } from './message-details/message-details.page';
import { Notifications } from 'src/app/model/notifications.model';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventsService } from 'src/app/services/events.service';
import { EventDetailsComponent } from 'src/app/shared/event-details/event-details.component';
import { SupportTicketDetailsComponent } from 'src/app/shared/support-ticket-details/support-ticket-details.component';
import { SupportTicketService } from 'src/app/services/support-ticket.service';
import { SupportTicket } from 'src/app/model/support-ticket.model';
import { OneSignalNotificationService } from 'src/app/services/one-signal-notification.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  currentUser: Users;
  active: "CHAT" | "NOTIFICATIONS" = "CHAT";
  userConversations: UserConversation[] = [];
  notifications: Notifications[] = [];
  pageIndex = 0;
  pageSize = 10;
  total = 0;
  isLoading = false;
  error: any;
  totalUnreadMessage = 0;
  totalUnreadNotification = 0;
  pageLoaded = false;
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  constructor(
    private cdr: ChangeDetectorRef,
    private statusBarService: StatusBarService,
    private modalCtrl: ModalController,
    private userConversationService: UserConversationService,
    private oneSignalNotificationService: OneSignalNotificationService,
    private supportTicketService: SupportTicketService,
    private eventsService: EventsService,
    private notificationService: NotificationService,
    private alertController: AlertController,
    private storageService: StorageService,
    private pageLoaderService: PageLoaderService,
    private animationService: AnimationService,
    private authService: AuthService,
  ) { 
    this.currentUser = this.storageService.getLoginProfile();
    this.oneSignalNotificationService.data$.subscribe(async (res: { type: 'EVENTS' | 'SUPPORT_TICKET' | 'MESSAGE'; referenceId; })=> {
      if(this.pageLoaded) {
        if(this.active === "CHAT" && (res.type === "EVENTS" || res.type === "MESSAGE")) {
          const userConversationRes = await this.userConversationService.getById(res.referenceId).toPromise();
          if(userConversationRes && userConversationRes.success && userConversationRes.data) {
            this.userConversations.find(x=>x.userConversationId === res.referenceId).dateTime = userConversationRes.data.dateTime;
            this.userConversations.find(x=>x.userConversationId === res.referenceId).title = userConversationRes.data.title;
            this.userConversations.find(x=>x.userConversationId === res.referenceId).description = userConversationRes.data.description;
            this.userConversations.find(x=>x.userConversationId === res.referenceId).status = "SENT";
            this.userConversations.find(x=>x.userConversationId === res.referenceId).unReadMessage = userConversationRes.data.unReadMessage;
            this.cdr.detectChanges();
          }
        } else {
          this.initNotifications(false, true);
        }
      }
    })
  }

  get isAuthenticated() {
    return this.currentUser && this.currentUser.userCode;
  }
  async ngOnInit(): Promise<void> {
    if(this.isAuthenticated) {
      this.pageIndex = 0;
      this.pageSize = 10;
      if(this.active === "CHAT") {
        await this.initUserConversations(true, true);
      } else {
        await this.initNotifications(true, true);
      }
      this.pageLoaded = true;
    }
  }

  ionViewWillEnter(){
    this.statusBarService.overLay(false);
    this.statusBarService.show(true);
    this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
  }

  async changeTab(active: "CHAT" | "NOTIFICATIONS") {
    this.pageLoaded = false;
    this.active = active;
    this.total = 0;
    this.pageIndex = 0;
    this.pageSize = 10;
    if(active === "CHAT") {
      await this.initUserConversations(true, true);
    } else {
      await this.initNotifications(true, true);
    }
    this.pageLoaded = true;
  }

  async initUserConversations(showProgress = false, clear = false) {
    try {
      if(clear) {
        this.userConversations = [];
      }
      this.isLoading = showProgress;
      const [paginated, _unReadMessage, _unReadNotif] = await Promise.all([
        this.userConversationService.getByAdvanceSearch({
        order: { dateTime: "DESC" },
        columnDef: [{
          apiNotation: "fromUser.userId",
          filter: this.currentUser?.userId,
          type: "precise"
        } as any],
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).toPromise(),
        this.userConversationService.getUnreadByUser(this.currentUser?.userId).toPromise(),
        this.notificationService.getUnreadByUser(this.currentUser?.userId).toPromise()
      ]);

      if(paginated.data.results) {
        this.userConversations = [ ...this.userConversations, ...paginated.data.results ];
        this.total = paginated.data.total;
      }

      if(_unReadMessage.success) {
        this.totalUnreadMessage = !isNaN(Number(_unReadMessage.data)) ? Number(_unReadMessage.data) : 0;
      }

      if(_unReadNotif.success) {
        this.totalUnreadNotification = !isNaN(Number(_unReadNotif.data)) ? Number(_unReadNotif.data) : 0;
      }
      const totalUnreadNotif = Number(this.totalUnreadMessage) + Number(this.totalUnreadNotification);
      this.storageService.saveTotalUnreadNotif(totalUnreadNotif);
      this.isLoading = false;
      this.cdr.detectChanges();
      if(this.ionRefresher) {
        this.ionRefresher.complete();
      }

    } catch (ex){
      this.isLoading = false;
      await this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
        buttons: ['OK']
      });
    }
  }

  async initNotifications(showProgress = false, clear = false) {
    try {
      if(clear) {
        this.notifications = [];
      }
      this.isLoading = showProgress;
      const [paginated, _unReadNotif, _unReadMessage] = await Promise.all([this.notificationService.getByAdvanceSearch({
        order: { notificationId: "DESC" },
        columnDef: [{
          apiNotation: "user.userId",
          filter: this.currentUser?.userId,
          type: "precise"
        } as any],
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
        }).toPromise(),
        this.notificationService.getUnreadByUser(this.currentUser?.userId).toPromise(),
        this.userConversationService.getUnreadByUser(this.currentUser?.userId).toPromise()
      ]);

      if(paginated.data.results) {
        this.notifications = [ ...this.notifications, ...paginated.data.results ];
        this.total = paginated.data.total;
      }
      
      if(_unReadMessage.success) {
        this.totalUnreadMessage = !isNaN(Number(_unReadMessage.data)) ? Number(_unReadMessage.data) : 0;
      }

      if(_unReadNotif.success) {
        this.totalUnreadNotification = !isNaN(Number(_unReadNotif.data)) ? Number(_unReadNotif.data) : 0;
      }
      const totalUnreadNotif = Number(this.totalUnreadMessage) + Number(this.totalUnreadNotification);
      this.storageService.saveTotalUnreadNotif(totalUnreadNotif);

      this.isLoading = false;
      this.cdr.detectChanges();
      if(this.ionRefresher) {
        this.ionRefresher.complete();
      }

    } catch (ex){
      this.isLoading = false;
      await this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
        buttons: ['OK']
      });
    }
  }

  async onOpenMessage(userConversation: UserConversation) {
    if(!this.isAuthenticated) {
      this.authService.logout();
    }
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: MessageDetailsPage,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal, userConversation, currentUser: this.currentUser, type: userConversation.type, refererPage: "MESSAGES" },
    });
    modal.present();
    this.statusBarService.show();
    this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
    modal.onDidDismiss().then((res: {data: Events; role})=> {
      this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
      if(userConversation && userConversation?.userConversationId) {
        this.userConversations.find(x=>x.userConversationId === userConversation?.userConversationId).status = "SEEN";
      }
    });
  }

  async onOpenNotif(notifications: Notifications) {
    if(!this.isAuthenticated) {
      this.authService.logout();
    }

    if(notifications.type === 'EVENTS') {
      await this.pageLoaderService.open('Loading please wait...');

      let modal: HTMLIonModalElement = null;
      modal = await this.modalCtrl.create({
        component: EventDetailsComponent,
        cssClass: 'modal-fullscreen',
        backdropDismiss: false,
        canDismiss: true,
        enterAnimation: this.animationService.pushLeftAnimation,
        leaveAnimation: this.animationService.leavePushLeftAnimation,
        componentProps: { modal, eventCode: notifications.referenceId },
      });
      modal.present();
      this.statusBarService.show();
      this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
      modal.onDidDismiss().then(res=> {
        this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
      });
      this.pageLoaderService.close();
      if(!notifications.isRead) {
        await this.markNotifAsRead(notifications);
      }
    } else if(notifications.type === 'SUPPORT_TICKET') {
      await this.pageLoaderService.open('Loading please wait...');
      const res = await this.supportTicketService.getByCode(notifications?.referenceId).toPromise();
      this.pageLoaderService.close();
      if(res.success) {
        let modal: HTMLIonModalElement = null;
        modal = await this.modalCtrl.create({
          component: SupportTicketDetailsComponent,
          cssClass: 'modal-fullscreen',
          backdropDismiss: false,
          canDismiss: true,
          enterAnimation: this.animationService.pushLeftAnimation,
          leaveAnimation: this.animationService.leavePushLeftAnimation,
          componentProps: { modal, supportTicket: res.data, },
        });
        modal.present();
        this.statusBarService.show();
        this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
        modal.onDidDismiss().then((res: {data: SupportTicket; role})=> {
          console.log(res);
          this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
        });
        this.pageLoaderService.close();
        this.markNotifAsRead(notifications);
        this.cdr.detectChanges();
      } else {
        await this.presentAlert({
          header: 'Try again!',
          message: Array.isArray(res.message) ? res.message[0] : res.message,
          buttons: ['OK']
        });
      }
    }
  }

  async markNotifAsRead(notifDetails: { notificationId: string }) {
    try{
      const [marAsRead, getUnreadByMessage, getUnreadNotif] = await Promise.all([
        this.notificationService.marAsRead(notifDetails.notificationId).toPromise(),
        this.userConversationService.getUnreadByUser(this.currentUser?.userId).toPromise(),
        this.notificationService.getUnreadByUser(this.currentUser?.userId).toPromise()
      ]);
      
      if (marAsRead.success) {
        this.notifications.filter(x=>x.notificationId === notifDetails.notificationId)[0].isRead = true;
        this.storageService.saveTotalUnreadNotif(marAsRead.data.totalUnreadNotif);
      } else {
        await this.presentAlert({
          header: 'Try again!',
          message: Array.isArray(marAsRead.message) ? marAsRead.message[0] : marAsRead.message,
          buttons: ['OK']
        });
        return;
      }
      
      if (getUnreadByMessage.success) {
        this.totalUnreadMessage = getUnreadByMessage.data;
      }
      
      if (getUnreadNotif.success) {
        this.totalUnreadNotification = getUnreadNotif.data;
      }
      this.cdr.detectChanges();
    } catch (e){
      await this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(e.message) ? e.message[0] : e.message,
        buttons: ['OK']
      });
    }
  }

  async loadMore() {
    this.pageLoaded = false;
    this.pageIndex = this.pageIndex + 1;
    if(this.active === "CHAT") {
      await this.initUserConversations();
    } else {
      await this.initNotifications();
    }
    this.pageLoaded = true;
  }

  async doRefresh(){
    try {
      this.pageLoaded = false;
      if(this.isLoading) {
        return;
      }
      this.pageIndex = 0;
      this.pageSize = 10;
      if(this.active === "CHAT") {
        await this.initUserConversations(true, true);
      } else {
        await this.initNotifications(true, true);
      }
      this.pageLoaded = true;
    }catch(ex) {
      this.isLoading = false;
      this.pageLoaded = false;
      if(this.ionRefresher) {
        this.ionRefresher.complete();
      }
      await this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
        buttons: ['OK']
      });
    }
  }

  getThumbnail(referenceId) {
    return `${environment.apiBaseUrl}/events/thumbnail/${referenceId}`;
  }

  imageErrorHandler(event) {
    event.target.src = getEventCardDefaultImage(null);
  }

  async presentAlert(options: any) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }

}
