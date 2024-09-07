import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { ActionSheetController, AlertController, IonRefresher, ModalController, ToastController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';
import { Events } from 'src/app/model/events.model';
import { Users } from 'src/app/model/users';
import { EventsService } from 'src/app/services/events.service';
import { StorageService } from 'src/app/services/storage.service';
import { DonateFormComponent } from '../donate-form/donate-form.component';
import { AnimationService } from 'src/app/services/animation.service';
import { EditEventFormComponent } from '../edit-event-form/edit-event-form.component';
import { getEventCardDefaultImage, getPersonDefaultImage } from '../utility/utility';
import { MessageDetailsPage } from 'src/app/pages/message/message-details/message-details.page';
import { UserConversation } from 'src/app/model/user-conversation.model';
import { EventNotificationsComponent } from '../event-notifications/event-notifications.component';
import { PageLoaderService } from 'src/app/services/page-loader.service';
import { Style } from '@capacitor/status-bar';
import { StatusBarService } from 'src/app/services/status-bar.service';
import { DonationListComponent } from '../donation-list/donation-list.component';
import { OneSignalNotificationService } from 'src/app/services/one-signal-notification.service';
import { Transactions } from 'src/app/model/transactions.model';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent  implements OnInit {
  eventCode;
  modal: HTMLIonModalElement;
  event: Events;
  isLoading = false;
  isProcessing = false;
  showError = false;
  currentViewImage;
  currentUser: Users;
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  @ViewChild('openImage') openImage: ElementRef<HTMLImageElement>;
  constructor(
    private cdr: ChangeDetectorRef,
    private eventsService: EventsService,
    private storageService: StorageService,
    private animationService: AnimationService,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private pageLoaderService: PageLoaderService,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private statusBarService: StatusBarService, 
    private oneSignalNotificationService: OneSignalNotificationService, 
  ) {
    this.currentUser = this.storageService.getLoginProfile();
    this.eventsService.data$.subscribe(async (res: Transactions)=> {
      console.log(res);
      if(res.transactionId && res.transactionId !== "" && res.transactionCode && res.transactionCode !== "") {
        const resEvent = await this.eventsService.getByCode(this.eventCode, this.currentUser?.userCode).toPromise();
        this.event.raisedDonation = resEvent.data.raisedDonation;
        this.event.visitorUserDonation = resEvent.data.visitorUserDonation;
        this.event.responded = resEvent.data.responded;
        this.event.interested = resEvent.data.interested;
        this.cdr.detectChanges();
      }
    });
   }

  async ngOnInit() {
    try {
      this.isLoading = true;
      this.eventsService.getByCode(this.eventCode, this.currentUser?.userCode).subscribe(res=> {

        this.event = res.data;
        this.isLoading = false;
        this.openImage.nativeElement.src = this.event?.thumbnailFile?.url;
        if(this.ionRefresher) {
          this.ionRefresher.complete();
        }
      }, async (err)=> {
        this.isLoading = false;
        this.showError = true;
        if(this.ionRefresher) {
          this.ionRefresher.complete();
        }
        await this.presentAlert({
          header: 'Try again!',
          message: Array.isArray(err.message) ? err.message[0] : err.message,
          buttons: ['OK']
        });
      });
    } catch(ex) {
      this.isLoading = false;
      this.showError = true;
      await this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
        buttons: ['OK']
      });
    }
  }

  async doRefresh() {
    try {
      if(this.isLoading) {
        return;
      }
      this.ngOnInit();
    } catch(ex) {
      this.isLoading = false;
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

  async updateEventInterested() {
    try {
      
      const actionSheet = await this.actionSheetController.create({
        buttons: [
          {
            text: this.event.isCurrentUserInterested ?  "No, I'm not Interested" : "Yes, I'm Interested",
            handler: async () => {
              this.isProcessing = true;
              this.event.isCurrentUserInterested = !this.event.isCurrentUserInterested;
              if(this.event.isCurrentUserInterested) {
                this.event.interested = this.event.interested && !isNaN(Number(this.event.interested)) ? Number(this.event.interested) + 1 : 1;
              } else  {
                this.event.interested = this.event.interested && !isNaN(Number(this.event.interested)) ? Number(this.event.interested) - 1 : 0;
              }
              this.eventsService.updateEventInterested(this.eventCode, { userCode: this.currentUser?.userCode}).subscribe(async res=> {

                // this.event = res.data;
                this.isLoading = false;
                this.isProcessing = false;
                const toast = await this.toastController.create({
                  message: 'Thank you for your feedback!',
                  duration: 1500,
                  layout: 'stacked',
                });
                toast.present();
                this.eventsService.sendUpdates(res.data);
            
              }, (err)=> {
                this.isLoading = false;
                this.showError = true;
                this.isProcessing = false;
                this.presentAlert({
                  header: 'Try Again!',
                  subHeader: 'There was an error when marking as going!',
                  message: err.message,
                  cssClass: 'alert-danger',
                  buttons: ['OK'],
                })
              });
            },
          },
          {
            text: 'Cancel',
            cssClass: 'close dismiss cancel',
            handler: async () => {
              actionSheet.dismiss();
            },
          },
        ],
      });
      await actionSheet.present();
    } catch(ex) {
      this.isLoading = false;
      this.showError = true;
      this.isProcessing = false;
      this.presentAlert({
        header: 'Try Again!',
        subHeader: 'There was an error when marking as going!',
        message: ex.message,
        cssClass: 'alert-danger',
        buttons: ['OK'],
      })
    }
  }

  async updateEventResponded() {
    try {
      const actionSheet = await this.actionSheetController.create({
        buttons: [
          {
            text: this.event.isCurrentUserResponded ? "No, I'm not Going" : "Yes, I'm Going",
            handler: async () => {
              this.isProcessing = true;
              this.event.isCurrentUserResponded = !this.event.isCurrentUserResponded;
              if(this.event.isCurrentUserResponded) {
                this.event.responded = this.event.responded && !isNaN(Number(this.event.responded)) ? Number(this.event.responded) + 1 : 1;
              } else  {
                this.event.responded = this.event.responded && !isNaN(Number(this.event.responded)) ? Number(this.event.responded) - 1 : 0;
              }
              this.eventsService.updateEventResponded(this.eventCode, { userCode: this.currentUser?.userCode}).subscribe(async res=> {
                // this.event = res.data;
                this.isLoading = false;
                this.isProcessing = false;
                const toast = await this.toastController.create({
                  message: 'Thank you for your feedback!',
                  duration: 1500,
                  layout: 'stacked',
                });
                toast.present();
                this.eventsService.sendUpdates(res.data);
              }, (err)=> {
                this.isLoading = false;
                this.showError = true;
                this.isProcessing = false;
                this.presentAlert({
                  header: 'Try Again!',
                  subHeader: 'There was an error when marking as going!',
                  message: err.message,
                  cssClass: 'alert-danger',
                  buttons: ['OK'],
                })
              });
            },
          },
          {
            text: 'Cancel',
            cssClass: 'close dismiss cancel',
            handler: async () => {
              actionSheet.dismiss();
            },
          },
        ],
      });
      await actionSheet.present();
    } catch(ex) {
      this.isLoading = false;
      this.showError = true;
      this.isProcessing = false;
      this.presentAlert({
        header: 'Try Again!',
        subHeader: 'There was an error when marking as going!',
        message: ex.message,
        cssClass: 'alert-danger',
        buttons: ['OK'],
      })
    }
  }

  async donate() {
    try {
      const actionSheet = await this.actionSheetController.create({
        header: 'Do you want to donate to this event?',
        buttons: [
          {
            text: "Yes, proceed please",
            handler: async () => {
              let modal: HTMLIonModalElement = null;
              modal = await this.modalCtrl.create({
                component: DonateFormComponent,
                cssClass: 'modal-fullscreen',
                backdropDismiss: false,
                canDismiss: true,
                enterAnimation: this.animationService.pushLeftAnimation,
                leaveAnimation: this.animationService.leavePushLeftAnimation,
                componentProps: { 
                  modal, 
                  event: this.event, 
                  currentUser: this.currentUser
                 },
              });
              modal.present();
              modal.onDidDismiss().then(res=> {
                console.log(res);
              });
            },
          },
          {
            text: 'No',
            cssClass: 'close dismiss cancel',
            handler: async () => {
              actionSheet.dismiss();
            },
          },
        ],
      });
      await actionSheet.present();
    } catch(ex) {
      this.isLoading = false;
      this.showError = true;
      this.isProcessing = false;
      this.presentAlert({
        header: 'Try Again!',
        subHeader: 'There was an error when marking as going!',
        message: ex.message,
        cssClass: 'alert-danger',
        buttons: ['OK'],
      })
    }
  }

  async openOptions() {
    try {
      const actionSheet = await this.actionSheetController.create({
        buttons: [
          {
            text: "Edit",
            handler: async () => {
              let modal: HTMLIonModalElement = null;
              modal = await this.modalCtrl.create({
                component: EditEventFormComponent,
                cssClass: 'modal-fullscreen',
                backdropDismiss: false,
                canDismiss: true,
                enterAnimation: this.animationService.pushLeftAnimation,
                leaveAnimation: this.animationService.leavePushLeftAnimation,
                componentProps: { modal, eventCode: this.eventCode },
              });
              modal.present();
              modal.onDidDismiss().then((res: { data: Events, role})=> {
                if(res?.role === "ok") {
                  this.doRefresh();
                }
              });
            },
          },
          {
            text: 'Cancel',
            cssClass: 'close dismiss cancel',
            handler: async () => {
              actionSheet.dismiss();
            },
          },
        ],
      });
      await actionSheet.present();
    } catch(ex) {
      this.isLoading = false;
      this.showError = true;
      this.isProcessing = false;
      this.presentAlert({
        header: 'Try Again!',
        subHeader: 'There was an error when marking as going!',
        message: ex.message,
        cssClass: 'alert-danger',
        buttons: ['OK'],
      })
    }
  }

  async onUpdateStaus(status: "INPROGRESS" | "COMPLETED" | "CANCELLED") {
    
    try {
      let headerMessage;
      if(status === "INPROGRESS") {
        headerMessage = `Are you sure you want to mark this ${this.event?.eventType !== 'ASSISTANCE' ? 'event' : 'request'} as In progress?`;
      } else if(status === "COMPLETED") {
        headerMessage = `Are you sure you want to mark this ${this.event?.eventType !== 'ASSISTANCE' ? 'event' : 'request'} as Completed?`;
      } else if(status === "CANCELLED") {
        headerMessage = `Are you sure you want to cancel this ${this.event?.eventType !== 'ASSISTANCE' ? 'event' : 'request'}?`;
      }

      const actionSheet = await this.actionSheetController.create({
        header: headerMessage,
        subHeader: "By continuing, you agree to our Terms of Service and Privacy Policy",
        buttons: [
          {
            text: "Yes, proceed",
            handler: async () => {
              try {
                await this.pageLoaderService.open('Please wait...');
                this.isProcessing = true;
                this.isLoading = true;
                const res = await this.eventsService.updateStatus(this.event?.eventCode, {
                  status
                }).toPromise();
                await this.pageLoaderService.close();
                this.isProcessing = false;
                this.isLoading = false;
                if(res.success && res.data) {
                  this.presentAlert({
                    header: 'Success!',
                    backdropDismiss: false,
                    message: `Status changed!`,
                    buttons: [{
                      text: 'OK',
                      handler: ()=> {
                        this.isProcessing = false;
                        this.isLoading = false;
                        this.doRefresh();
                        this.eventsService.sendUpdates(res.data);
                      }
                    }]
                  });
                } else {
                  this.isProcessing = false;
                  this.isLoading = false;
                  this.presentAlert({
                    header: 'Try again!',
                    message: Array.isArray(res.message) ? res.message[0] : res.message,
                    buttons: ['OK']
                  });
                }
              } catch(ex) {
                this.isProcessing = false;
                this.isLoading = false;
                this.presentAlert({
                  header: 'Try again!',
                  message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
                  buttons: ['OK']
                });
              }
            },
          },
          {
            text: 'Cancel',
            cssClass: 'close dismiss cancel',
            handler: async () => {
              actionSheet.dismiss();
              this.isProcessing = false;
              this.isLoading = false;
            },
          },
        ],
      });
      actionSheet.present();
    } catch (e) {
      this.isProcessing = false;
      this.isLoading = false;
      this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(e.message) ? e.message[0] : e.message,
        buttons: ['OK']
      });
    }
  }

  async openMap(latitude, longitude) {
    if (Capacitor.platform === 'android') {
      window.location.href = 'geo:' + latitude+', '+longitude;
    } else {
      window.open('https://www.google.com/maps/search/?api=1&query='+latitude+','+longitude);
    }
  }

  getDonationPercentage(event: Events, wholeValue = false) {
    if(wholeValue && event && !isNaN(Number(event?.raisedDonation)) && !isNaN(Number(event?.donationTargetAmount))) {
      const percent = (Number(event?.raisedDonation) / Number(event?.donationTargetAmount)) * 100;
      return percent.toFixed(2); // Format to two decimal places if needed
    } else if(event && !isNaN(Number(event?.raisedDonation)) && !isNaN(Number(event?.donationTargetAmount))) {
      const percent = (Number(event?.raisedDonation) / Number(event?.donationTargetAmount));
      return percent;
    } else {
      return 0;
    }
  }

  async onOpenEventNotification() {
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: EventNotificationsComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal, event: this.event, currentUser: this.currentUser, },
    });
    modal.present();
    this.statusBarService.show();
    this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
    modal.onDidDismiss().then(async (res: {data: Events; role})=> {
      this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
      try {
        const res = await this.eventsService.getByCode(this.eventCode, this.currentUser?.userCode).toPromise();
        this.event.visitorUnReadMessage = res.data.visitorUnReadMessage;
        this.event.visitorUserConversation = res.data.visitorUserConversation;
      } catch(ex) {
        this.isLoading = false;
        this.showError = true;
        await this.presentAlert({
          header: 'Try again!',
          message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
          buttons: ['OK']
        });
      }
    });
  }

  async onOpenEventMessage() {
    const userConversation = this.event?.visitorUserConversation && this.event?.visitorUserConversation?.userConversationId ? {
      ...this.event?.visitorUserConversation,
      event: this.event,
      fromUser: this.currentUser,
      toUser: this.event?.user,
    } : {
      referenceId: this.event.eventCode,
      title: this.event.eventName,
      event: this.event,
      fromUser: this.currentUser,
      toUser: this.event?.user,
      type: "EVENTS",
    } as UserConversation;
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: MessageDetailsPage,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal, userConversation, currentUser: this.currentUser, type: "EVENTS", refererPage: "EVENT_DETAILS" },
    });
    modal.present();
    this.statusBarService.show();
    this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
    modal.onDidDismiss().then(async (res: {data: Events; role})=> {
      this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
      try {
        const res = await this.eventsService.getByCode(this.eventCode, this.currentUser?.userCode).toPromise();
        this.event.visitorUnReadMessage = res.data.visitorUnReadMessage;
        this.event.visitorUserConversation = res.data.visitorUserConversation;
      } catch(ex) {
        this.isLoading = false;
        this.showError = true;
        await this.presentAlert({
          header: 'Try again!',
          message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
          buttons: ['OK']
        });
      }
    });
  }

  async onOpenEventDonationList() {
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: DonationListComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal, event: this.event },
    });
    this.statusBarService.show();
    this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
    modal.present();
    modal.onDidDismiss().then(async (res: {role: string})=> {
      this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
    });
  }

  close() {
    this.modal.dismiss();
  }

  imageErrorHandler(event, type: "CHARITY" | "VOLUNTEER" | "DONATION" | "ASSISTANCE") {
    event.target.src = getEventCardDefaultImage(this.event?.eventType);
  }
  
  profilePicErrorHandler(event) {
    event.target.src = getPersonDefaultImage(null);
  }

  async presentAlert(options: AlertOptions) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }
}