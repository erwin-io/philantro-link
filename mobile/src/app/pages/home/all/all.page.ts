import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Events } from 'src/app/model/events.model';
import { GeoLocationService } from 'src/app/services/geo-location.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertController, IonRefresher, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';
import { AnimationService } from 'src/app/services/animation.service';
import { EventDetailsComponent } from 'src/app/shared/event-details/event-details.component';
import { Users } from 'src/app/model/users';
import { Style } from '@capacitor/status-bar';
import { StatusBarService } from 'src/app/services/status-bar.service';

@Component({
  selector: 'app-all',
  templateUrl: './all.page.html',
  styleUrls: ['./all.page.scss'],
})
export class AllPage implements OnInit {
  help: Events[] = [];
  helpTotal = 0;
  helpPageIndex = 0;
  helpPageSize = 5;
  nonHelpEvents: Events[] = [];
  nonHelpEventsTotal = 0;
  nonHelpEventsPageIndex = 0;
  nonHelpEventsPageSize = 10;
  isHelpLoading = false;
  isNonHelpEventsLoading = false;
  currentUser: Users;
  geolocationPosition: { coords: { latitude: number; longitude: number; }};
  constructor(
    private router: Router,
    private alertController: AlertController,
    private dashboardService: DashboardService, 
    private geoLocationService: GeoLocationService, 
    private statusBarService: StatusBarService, 
    private eventsService: EventsService, 
    private storageService: StorageService,
    private animationService: AnimationService,
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
    this.router.events.subscribe((event: any) => {
      if (event?.url && event.url !== '/home/all') {
        const tab = event.url.split("home/")[1];
        const tabButton = document.getElementById(`tab-${tab}`);
        if (tabButton) {
          tabButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    });
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
      this.isHelpLoading = false;
      this.isNonHelpEventsLoading = false;
      this.dashboardService.stopRefresh();
    }
  }

  async initHelp() {
    try {
      this.isHelpLoading = true;
      const {latitude, longitude} = this.geolocationPosition?.coords;
      const res = await this.dashboardService.getClientEventFeed({
        latitude,
        longitude,
        radius: 40000,
        eventType: ["ASSISTANCE"],
        skip: this.helpPageIndex * this.helpPageSize,
        limit: this.helpPageSize,
        userCode: this.currentUser?.userCode
      }).toPromise();
        
      this.help = res.data.results;
      this.helpTotal = res.data.total;
      this.isHelpLoading = false;
    } catch(ex) {
      this.isHelpLoading = false;
      this.isNonHelpEventsLoading = false;
      this.dashboardService.stopRefresh();
    }
  }

  async initNonHelpEvents(showProgress = false) {
    try {
      this.isNonHelpEventsLoading = showProgress;
      const {latitude, longitude} = this.geolocationPosition?.coords;
      const res = await this.dashboardService.getClientEventFeed({
        latitude,
        longitude,
        radius: 40000,
        eventType: ["DONATION", "CHARITY", "VOLUNTEER"],
        skip: this.nonHelpEventsPageIndex * this.nonHelpEventsPageSize,
        limit: this.nonHelpEventsPageSize,
        userCode: this.currentUser?.userCode
      }).toPromise()
        
      for (var event of res.data.results) {
        if(!this.nonHelpEvents.some(x=> x.eventId === event.eventId)) {
          this.nonHelpEvents.push(event);
        }
      }
      this.nonHelpEventsTotal = res.data.total;
      this.isNonHelpEventsLoading = false;
    } catch(ex) {
      this.isHelpLoading = false;
      this.isNonHelpEventsLoading = false;
      this.dashboardService.stopRefresh();
    }
  }

  async loadMore() {
    this.nonHelpEventsPageIndex = this.nonHelpEventsPageIndex + 1;
    await this.initNonHelpEvents();
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
      if(this.isHelpLoading || this.isNonHelpEventsLoading) {
        this.dashboardService.stopRefresh();
        this.isHelpLoading = false;
        this.isNonHelpEventsLoading = false;
        return;
      }
      this.helpPageIndex = 0;
      this.helpPageSize = 5;
      this.nonHelpEventsPageIndex = 0;
      this.nonHelpEventsPageSize = 10;
      this.help = [];
      this.nonHelpEvents = [];
      if(!this.geolocationPosition || !this.geolocationPosition?.coords || !this.geolocationPosition?.coords?.latitude || !this.geolocationPosition?.coords?.longitude) {
        this.initLocation()
      }
      await Promise.all([
        this.initHelp(),
        this.initNonHelpEvents(true),
      ]);
      this.dashboardService.stopRefresh();
    }catch(ex) {
      this.isHelpLoading = false;
      this.isNonHelpEventsLoading = false;
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
