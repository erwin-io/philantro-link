/* eslint-disable @typescript-eslint/member-ordering */
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { StorageService } from '../services/storage.service';
import { StatusBar, Style } from '@capacitor/status-bar';
import { StatusBarService } from '../services/status-bar.service';
import { DeviceInfo } from '@capacitor/device';
import { DeviceService } from '../services/device.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.page.html',
  styleUrls: ['./navigation.page.scss'],
})
export class NavigationPage implements OnInit, OnDestroy {
  currentUser: any;
  active = '';
  // totalUnreadNotification = 0;
  private _deviceInfo: DeviceInfo;
  constructor(
    private storageService: StorageService,
    private deviceService: DeviceService,
    private platform: Platform,
    private statusBarService: StatusBarService,
    private alertController: AlertController) {
      this.currentUser = this.storageService.getLoginProfile();
    }

  get totalUnreadNotification() {
    const total = this.storageService.getTotalUnreadNotif();
    return total? Number(total) : 0;
  }
  get deviceInfo() {
    return this._deviceInfo ? {
      platform: this._deviceInfo?.platform,
      osVersion: Number(this._deviceInfo?.osVersion??0)
    } : {
      platform: '',
      osVersion: 0,
    } as any;
  }

  async ngOnInit() {
    if (Capacitor.platform !== 'web') {
      this._deviceInfo = await this.deviceService.getInfo();
    }
  }
  ngOnDestroy() {
    //stop session
  }

  ionViewWillLeave(){
  }

  async onTabsWillChange(event) {
    this.active = event.tab;
    let getPlatform = Capacitor.getPlatform();
    if (getPlatform !== 'web') {
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @HostListener('click', ['$event.target']) onClick(e) {
  }

  async presentAlert(options: AlertOptions) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }
}
