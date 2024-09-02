import { Component, OnInit, ViewChild } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { DeviceInfo } from '@capacitor/device';
import { Style } from '@capacitor/status-bar';
import { AlertController, IonRefresher, ModalController } from '@ionic/angular';
import { Events } from 'src/app/model/events.model';
import { Users } from 'src/app/model/users';
import { AnimationService } from 'src/app/services/animation.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { EventsService } from 'src/app/services/events.service';
import { GeoLocationService } from 'src/app/services/geo-location.service';
import { StatusBarService } from 'src/app/services/status-bar.service';
import { StorageService } from 'src/app/services/storage.service';
import { CreateEventFormComponent } from 'src/app/shared/create-event-form/create-event-form.component';
import { EventDetailsComponent } from 'src/app/shared/event-details/event-details.component';
import { EventTypePickerComponent } from 'src/app/shared/event-type-picker/event-type-picker.component';
import { JoinedEventsComponent } from './joined-events/joined-events.component';
import { InterestedEventsComponent } from './interested-events/interested-events.component';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
})
export class MyEventsPage implements OnInit {
  currentUser: Users;
  events: Events[] = [];
  eventsTotal = 0;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  geolocationPosition: GeolocationPosition;
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  constructor(
    private alertController: AlertController,
    private eventsService: EventsService, 
    private geoLocationService: GeoLocationService, 
    private statusBarService: StatusBarService, 
    private storageService: StorageService,
    private modalCtrl: ModalController,
    private animationService: AnimationService,) { 
      this.currentUser = this.storageService.getLoginProfile();
    }

  async ngOnInit() {
    this.initEvents(true);
  }

  async initEvents(showProgress = false) {
    this.isLoading = showProgress;
    const res = await this.eventsService.getByAdvanceSearch({
      order: { dateTimeUpdate: "DESC", eventId: "ASC",  },
      columnDef: [{
        apiNotation: "user.userCode",
        filter: this.currentUser?.userCode,
        type: "precise"
      } as any],
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }).toPromise();
    for (var event of res.data.results) {
      if(!this.events.some(x=> x.eventId === event.eventId)) {
        this.events.push(event);
      }
    }
    this.eventsTotal = res.data.total;
    this.isLoading = false;
    if(this.ionRefresher) {
      this.ionRefresher.complete();
    }
  }

  async loadMore() {
    this.pageIndex = this.pageIndex + 1;
    await this.initEvents();
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

  async openAddModal() {
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: CreateEventFormComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal },
    });
    this.statusBarService.show();
    this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
    modal.present();
    modal.onDidDismiss().then((res: {data: Events; role})=> {
      this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
      if(res?.role === "ok" && res?.data) {
        this.pageIndex = 0;
        this.pageSize = 10;
        this.events = [];
        this.initEvents(true);
      }
    });
  }

  async openJoinedEvents() {
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: JoinedEventsComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal },
    });
    modal.present();
    this.statusBarService.show();
    this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
    modal.onDidDismiss().then(res=> {
      this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
    });
  }

  async openInterestedEvents() {
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: InterestedEventsComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal },
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
        return;
      }
      this.pageIndex = 0;
      this.pageSize = 10;
      this.events = [];
      this.initEvents(true);
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

  async presentAlert(options: any) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }

  ionViewWillEnter(){
    this.statusBarService.overLay(false);
    this.statusBarService.show(true);
    this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
  }
}
