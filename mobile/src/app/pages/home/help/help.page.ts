import { Component, OnInit } from '@angular/core';
import { Style } from '@capacitor/status-bar';
import { AlertController, ModalController } from '@ionic/angular';
import { Events } from 'src/app/model/events.model';
import { Users } from 'src/app/model/users';
import { AnimationService } from 'src/app/services/animation.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { GeoLocationService } from 'src/app/services/geo-location.service';
import { StatusBarService } from 'src/app/services/status-bar.service';
import { StorageService } from 'src/app/services/storage.service';
import { EventDetailsComponent } from 'src/app/shared/event-details/event-details.component';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  active: 'ALL' | 'FOOD' | 'WATER' | 'CLOTHING' | 'SERVICES' = 'ALL';
  help: Events[] = [];
  helpTotal = 0;
  helpPageIndex = 0;
  helpPageSize = 10;
  isLoading = false;
  geolocationPosition: { coords: { latitude: number; longitude: number; }};
  currentUser: Users;
  constructor(
    private alertController: AlertController,
    private dashboardService: DashboardService, 
    private geoLocationService: GeoLocationService, 
    private storageService: StorageService,
    private animationService: AnimationService,
    private statusBarService: StatusBarService, 
    private modalCtrl: ModalController,) { 
      this.currentUser = this.storageService.getLoginProfile();
      this.dashboardService.refresh$.subscribe((res: { refresh: boolean })=> {
        if(res?.refresh) {
          this.doRefresh();
        }
      })
      this.geoLocationService.locationPickerData$.subscribe(async (res: {
        latitude: number;
        longitude: number;
    })=> {
      if(!this.geolocationPosition || !this.geolocationPosition.coords) {
        this.geolocationPosition = {
          coords: res
        }
      } else {
        this.geolocationPosition.coords.latitude = res.latitude;
        this.geolocationPosition.coords.longitude = res.longitude;
        this.doRefresh();
      }
      });
    }

  async ngOnInit() {
    this.dashboardService.doRefresh();
  }

  async initLocation() {
    try {
      this.geolocationPosition = this.storageService.getCurrentLocation();
      if(!this.geolocationPosition || !this.geolocationPosition?.coords || !this.geolocationPosition?.coords?.latitude || !this.geolocationPosition?.coords?.longitude) {
        this.geolocationPosition = await this.geoLocationService.getCurrentPosition();
      }
      if(this.geolocationPosition?.coords && this.geolocationPosition?.coords.latitude && this.geolocationPosition?.coords?.longitude) {
        this.storageService.saveCurrentLocation(this.geolocationPosition);
      }
    } catch(ex) {
      this.dashboardService.stopRefresh();
      this.isLoading = false;
    }
  }

  async initHelp(showProgress = false) {
    try {
      this.isLoading = showProgress;
      const {latitude, longitude} = this.geolocationPosition?.coords;
      const res = await this.dashboardService.getClientHelpFeed({
        latitude,
        longitude,
        radius: 40000,
        helpType: this.active === "ALL" ? ["WATER","FOOD","CLOTHING","SERVICES"] : [this.active],
        skip: this.helpPageIndex * this.helpPageSize,
        limit: this.helpPageSize,
        userCode: this.currentUser?.userCode
      }).toPromise();
      for (var event of res.data.results) {
        if(!this.help.some(x=> x.eventId === event.eventId)) {
          this.help.push(event);
        }
      }
      this.helpTotal = res.data.total;
      this.isLoading = false;
    } catch(ex) {
      this.dashboardService.stopRefresh();
      this.isLoading = false;
    }
  }

  async getHelpEvent(active) {
    this.active = active;
    this.dashboardService.doRefresh();
  }

  async loadMore() {
    this.helpPageIndex = this.helpPageIndex + 1;
    await this.initHelp();
  }

  async openEvent(eventCode) {
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: EventDetailsComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal, eventCode },
    });
    modal.present();
    this.statusBarService.show();
    this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
    modal.onDidDismiss().then(res=> {
      this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
    });
  }

  async doRefresh(){
    try {
      if(this.isLoading) {
        this.dashboardService.stopRefresh();
        this.isLoading = false;
        return;
      }
      this.helpPageIndex = 0;
      this.helpPageSize = 10;
      this.help = [];
      if(!this.geolocationPosition || !this.geolocationPosition?.coords || !this.geolocationPosition?.coords?.latitude || !this.geolocationPosition?.coords?.longitude) {
        this.initLocation()
      }
      await this.initHelp(true),
      this.dashboardService.stopRefresh();
    }catch(ex) {
      this.isLoading = false;
      this.dashboardService.stopRefresh();
      await this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
        buttons: ['OK']
      });
    }
  }

  async presentAlert(options: any) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }

}
