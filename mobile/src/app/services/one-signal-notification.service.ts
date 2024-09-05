import { Injectable } from '@angular/core';
import OneSignalPlugin from 'onesignal-cordova-plugin';
import { environment } from 'src/environments/environment';
import { UserOneSignalSubscriptionService } from './user-one-signal-subscription.service';
import { AuthService } from './auth.service';
import { ModalController } from '@ionic/angular';
import { AnimationService } from './animation.service';
import { BehaviorSubject, forkJoin } from 'rxjs';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
  PushNotification,
  PushNotificationActionPerformed,
  PushNotificationToken,
} from '@capacitor/push-notifications';
import { PageLoaderService } from './page-loader.service';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';
import { UserConversationService } from './user-conversation.service';
import { EventsService } from './events.service';
import { SupportTicketService } from './support-ticket.service';
import { EventDetailsComponent } from '../shared/event-details/event-details.component';
import { SupportTicketDetailsComponent } from '../shared/support-ticket-details/support-ticket-details.component';
import { SupportTicket } from '../model/support-ticket.model';
import { MessageDetailsPage } from '../pages/message/message-details/message-details.page';
import { UserConversation } from '../model/user-conversation.model';
@Injectable({
  providedIn: 'root'
})
export class OneSignalNotificationService {
  private data = new BehaviorSubject({});
  data$ = this.data.asObservable();

  constructor(
    private storageService: StorageService,
    private pageLoaderService: PageLoaderService,
    private modalCtrl: ModalController,
    private notificationService: NotificationService,
    private eventsService: EventsService,
    private supportTicketService: SupportTicketService,
    private userConversationService: UserConversationService,
    private animationService: AnimationService,
    private authService: AuthService,
    private userOneSignalSubscriptionService: UserOneSignalSubscriptionService) { }


  get isAuthenticated() {
    const currentUser = this.storageService.getLoginProfile();
    return currentUser;
  }

  async registerOneSignal() {
    console.log('calling setAppId');
    PushNotifications.createChannel({
     id: 'fcm_default_channel',
     name: 'PhilantroLink',
     importance: 5,
     visibility: 1,
     lights: true,
     vibration: true,
     sound: 'notif_alert'
    });
    OneSignalPlugin.setLogLevel(6, 0);
    OneSignalPlugin.setAppId(environment.oneSignalAppId);
    OneSignalPlugin.promptForPushNotificationsWithUserResponse(true);
    OneSignalPlugin.getDeviceState(res=> {
      console.log('getDeviceState ', JSON.stringify(res));
      this.addCredentials();
    });
    this.addCredentials();
    console.log('calling addSubscriptionObserver');
    OneSignalPlugin.addSubscriptionObserver(res=> {
      console.log('Subscription id ', res?.to?.userId);

      this.storageService.saveOneSignalSubscriptionId(res?.to?.userId);
      if(this.isAuthenticated) {
        // this.addCredentials();
        // const currentUser = this.storageService.getLoginProfile();
        // this.userOneSignalSubscriptionService.create({
        //   userId: currentUser?.userId,
        //   subscriptionId: res?.to?.userId
        // }).subscribe((res)=> {
        //   console.log('subscription saved');
        // }, (err)=>{console.log('error saving subscription');console.log(err);});
      }
    });
    console.log('calling addPermissionObserver');
    OneSignalPlugin.addPermissionObserver(res=> {
      console.log('addPermissionObserver result', JSON.stringify(res));
    });
    OneSignalPlugin.setNotificationOpenedHandler(async res=> {
      if(!this.isAuthenticated) {
        this.authService.logout();
      }
      const currentUser = this.storageService.getLoginProfile();
      console.log('setNotificationOpenedHandler result', JSON.stringify(res));
      console.log('received data from api : ' + JSON.stringify(res?.notification?.additionalData));
      const { type, referenceId } = res?.notification?.additionalData as any;
      if(type.toString().toUpperCase() === 'EVENTS' && referenceId && referenceId !== '') {
        let modal: HTMLIonModalElement = null;
        modal = await this.modalCtrl.create({
          component: EventDetailsComponent,
          cssClass: 'modal-fullscreen',
          backdropDismiss: false,
          canDismiss: true,
          enterAnimation: this.animationService.pushLeftAnimation,
          leaveAnimation: this.animationService.leavePushLeftAnimation,
          componentProps: { modal, eventCode: referenceId },
        });
        modal.present();
        modal.onDidDismiss().then(res=> {
        });
        await this.refreshUnreadCount();
      } else if(type === 'SUPPORT_TICKET' && referenceId && referenceId !== '') {
        const [res] = await Promise.all([
          this.supportTicketService.getByCode(referenceId, currentUser?.userCode).toPromise(),
          this.refreshUnreadCount()
        ]);
        
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
        modal.onDidDismiss().then((res: {data: SupportTicket; role})=> {
        });
      } else if(type === 'MESSAGE' && referenceId && referenceId !== '') {
        const [res] = await Promise.all([
          this.userConversationService.getById(referenceId).toPromise(),
          this.refreshUnreadCount()
        ]);
        
        let modal: HTMLIonModalElement = null;
        modal = await this.modalCtrl.create({
          component: MessageDetailsPage,
          cssClass: 'modal-fullscreen',
          backdropDismiss: false,
          canDismiss: true,
          enterAnimation: this.animationService.pushLeftAnimation,
          leaveAnimation: this.animationService.leavePushLeftAnimation,
          componentProps: { modal, userConversation: res.data, currentUser, type: res.data.type,  },
        });
        modal.present();
        modal.onDidDismiss().then((res: {data: UserConversation; role})=> {
        });
      }
    });

    OneSignalPlugin.setNotificationWillShowInForegroundHandler(res=> {
      console.log('Nofication received data ', JSON.stringify(res.getNotification().additionalData));
      const { notificationIds, inAppData, type, referenceId } = res.getNotification().additionalData as any;
      if(notificationIds) {
        this.storageService.saveReceivedNotification(notificationIds);
      }
      if(inAppData) {
        // OneSignalPlugin.removeTriggerForKey('in_app_type');
        const { name } = inAppData;
        OneSignalPlugin.addTrigger('in_app_type', name);
      }

      this.data.next({ notificationIds, inAppData, type, referenceId })
    });
  }

  async addCredentials() {
    if(this.isAuthenticated) {
      const currentUser = this.storageService.getLoginProfile();
      console.log('OneSignalPlugin.setExternalUserId  ', currentUser?.userName);
      OneSignalPlugin.setExternalUserId(currentUser?.userName);
    }
  }

  async refreshUnreadCount() {
    await this.pageLoaderService.open('Loading please wait...');
    const currentUser = this.storageService.getLoginProfile();
    const [_unReadNotif, _unReadMessage] = await forkJoin([
      this.notificationService.getUnreadByUser(currentUser.userCode),
      this.userConversationService.getUnreadByUser(currentUser.userCode),
    ]).toPromise();
    

    let unReadMessage = 0;
    let unReadNotif = 0;

    if(_unReadMessage.data) {
      unReadMessage = !isNaN(Number(_unReadMessage.data)) ? Number(_unReadMessage.data) : 0;
    }

    if(_unReadNotif.data) {
      unReadNotif = !isNaN(Number(_unReadNotif.data)) ? Number(_unReadNotif.data) : 0;
    }
    const totalUnreadNotif = Number(unReadMessage) + Number(unReadNotif);
    this.storageService.saveTotalUnreadNotif(totalUnreadNotif);
    this.pageLoaderService.close();
  }
}
