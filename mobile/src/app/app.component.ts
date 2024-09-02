import { Component, NgZone } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Platform, AlertController, ActionSheetController, ModalController } from '@ionic/angular';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { LocalNotificationsService } from './services/local-notifications.service';
import { OneSignalNotificationService } from './services/one-signal-notification.service';
import { BackgroundGeolocationService } from './services/background-geolocation.service';
import { GeoLocationService } from './services/geo-location.service';
import { Users } from './model/users';
import { Device } from '@capacitor/device';
import { DeviceService } from './services/device.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  currentUser: Users;
  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private deviceService: DeviceService,
    private actionSheetController: ActionSheetController,
    private modalCtrl: ModalController,
    private geoLocationService: GeoLocationService,
    private oneSignalNotificationService: OneSignalNotificationService,
    private localNotificationsService: LocalNotificationsService,
    private router: Router, private zone: NgZone) {


    this.platform.backButton.subscribeWithPriority(10, async () => {
      const modal = await this.modalCtrl.getTop();
      const activeSheet = await this.actionSheetController.getTop();
      if (modal) {
          modal.dismiss();
      } else if(activeSheet) {
        activeSheet.dismiss();
      }else {
        const actionSheet = await this.actionSheetController.create({
          buttons: [
            {
              text: 'Minimize the app?',
              handler: async () => {
                App.minimizeApp();
                actionSheet.dismiss();
              },
            },
            {
              text: 'Close the app?',
              handler: async () => {
                App.exitApp();
                actionSheet.dismiss();
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
      }
    });

  }
  ionViewWillEnter() {
  }

  initializeApp() {
    // App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
    //     this.zone.run(() => {
    //         const slug = event.url.split('://').pop();
    //         if (slug) {
    //             this.router.navigateByUrl(slug);
    //         }
    //         // If no match, do nothing - let regular routing
    //         // logic take over
    //     });
    // });
  }

  async ngOnInit(): Promise<void> {
    await this.geoLocationService.startWatchingPosition();
    this.platform.ready().then(async () => {
      if (Capacitor.platform !== 'web') {
        await this.deviceService.init();
        await this.localNotificationsService.init();
        await this.oneSignalNotificationService.registerOneSignal();
      }
    });
  }
  
  
}
