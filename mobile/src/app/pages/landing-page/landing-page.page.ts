import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { AnimationService } from 'src/app/services/animation.service';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DeviceService } from 'src/app/services/device.service';
import { OneSignalNotificationService } from 'src/app/services/one-signal-notification.service';
import { LocalNotificationsService } from 'src/app/services/local-notifications.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private platform: Platform,
    private deviceService: DeviceService,
    private oneSignalNotificationService: OneSignalNotificationService,
    private localNotificationsService: LocalNotificationsService,
    private animationService: AnimationService) { }

  ngOnInit() {
    this.modifyStatusBar();
    this.platform.ready().then(async () => {
      if (Capacitor.platform !== 'web') {
        await this.deviceService.init();
        await this.localNotificationsService.init();
        await this.oneSignalNotificationService.registerOneSignal();
      }
    });
  }

  async onShowLoginDialog() {
    let modal!: HTMLIonModalElement;
    modal = await this.modalCtrl.create({
      component: LoginComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal },
    });
    modal.onDidDismiss().then(()=> {
      // this.modifyStatusBar();
    });
    modal.present();
  }

  async onShowRegisterDialog() {
    let modal!: HTMLIonModalElement;
    modal = await this.modalCtrl.create({
      component: RegisterComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal },
    });
    modal.onDidDismiss().then(()=> {
      this.modifyStatusBar();
    });
    modal.present();
  }

  async modifyStatusBar() {
    let getPlatform = Capacitor.getPlatform();
    if (getPlatform !== 'web') {
      await StatusBar.setOverlaysWebView({overlay: true});
      await StatusBar.setStyle({style: Style.Dark});
    }
  }

  onOpenDriverSettings(){

  }

}
