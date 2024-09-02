/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { forkJoin } from 'rxjs';
import { AuthService } from './auth.service';
import { ModalController } from '@ionic/angular';
import { NotificationService } from './notification.service';
import { AnimationService } from './animation.service';
import { PageLoaderService } from './page-loader.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {

  constructor(
    private authService: AuthService,
    private pageLoaderService: PageLoaderService,
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private animationService: AnimationService) { }


  get isAuthenticated() {
    const currentUser = this.storageService.getLoginProfile();
    return currentUser;
  }

  init() {
    // adding the listener

    LocalNotifications.addListener('localNotificationActionPerformed', async (payload) => {
      // triggers when the notification is clicked.
      console.log('local notifications data: ', JSON.stringify(payload));
      if(payload?.notification?.extra) {
        const { type, referenceId } = payload?.notification?.extra;
        if(type.toString().toUpperCase() === 'ANNOUNCEMENT') {

        } else if(type === 'LINK_STUDENT') {
          if(!this.isAuthenticated) {
            this.authService.logout();
          }
          await this.pageLoaderService.open('Loading please wait...');
          const currentUser = this.storageService.getLoginProfile();
          const [notifRes] = await forkJoin([
            this.notificationService.getUnreadByUser(currentUser.userId),
          ]).toPromise();
          this.storageService.saveTotalUnreadNotif(notifRes.data);
          this.pageLoaderService.close();
        } else if(type === 'STUDENT_LOGIN_LOGOUT' && referenceId && referenceId !== '') {
        if(!this.isAuthenticated) {
          this.authService.logout();
        }
        await this.pageLoaderService.open('Loading please wait...');
        const currentUser = this.storageService.getLoginProfile();
        const [notifRes] = await forkJoin([
          this.notificationService.getUnreadByUser(currentUser.userId),
        ]).toPromise();
        this.storageService.saveTotalUnreadNotif(notifRes.data);
        this.pageLoaderService.close();
        }
      }
    });
  }
}
