import { Component, OnInit, ViewChild } from '@angular/core';
import { Style } from '@capacitor/status-bar';
import { IonRefresher, ModalController, AlertController } from '@ionic/angular';
import { Events } from 'src/app/model/events.model';
import { Users } from 'src/app/model/users';
import { AnimationService } from 'src/app/services/animation.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventsService } from 'src/app/services/events.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PageLoaderService } from 'src/app/services/page-loader.service';
import { StatusBarService } from 'src/app/services/status-bar.service';
import { StorageService } from 'src/app/services/storage.service';
import { EventDetailsComponent } from 'src/app/shared/event-details/event-details.component';
import { getEventCardDefaultImage } from 'src/app/shared/utility/utility';

@Component({
  selector: 'app-interested-events',
  templateUrl: './interested-events.component.html',
  styleUrls: ['./interested-events.component.scss'],
})
export class InterestedEventsComponent implements OnInit {
  modal: HTMLIonModalElement;
  currentUser: Users;
  events: Events[] = [];
  pageIndex = 0;
  pageSize = 10;
  total = 0;
  isLoading = false;
  error: any;
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  constructor(
    private statusBarService: StatusBarService,
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private supportTicketService: EventsService,
    private pageLoaderService: PageLoaderService,
    private animationService: AnimationService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private alertController: AlertController) { 
      this.currentUser = this.storageService.getLoginProfile();
    }

  get isAuthenticated() {
    return this.currentUser && this.currentUser.userCode;
  }
  ngOnInit() {
    if(this.isAuthenticated) {
      this.pageIndex = 0;
      this.pageSize = 10;
      this.initInterestedEvents(true, true);
    }
  }

  imageErrorHandler(event, type: "CHARITY" | "VOLUNTEER" | "DONATION" | "ASSISTANCE") {
    event.target.src = getEventCardDefaultImage(type);
  }

  ionViewWillEnter(){
  }

  async initInterestedEvents(showProgress = false, clear = false) {
    try {
      if(clear) {
        this.events = [];
      }
      this.isLoading = showProgress;
      this.supportTicketService.getPageInterestedEvents({
        order: { dateTimeUpdate: "DESC", eventId: "ASC",  },
        userCode: this.currentUser?.userCode,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).subscribe(res =>{
        
        if(res.data.results) {
          this.events = [ ...this.events, ...res.data.results ];
          this.total = res.data.total;
        }
      })
      this.isLoading = false;
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

  async onOpenEvent(event: Events) {
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: EventDetailsComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal, eventCode: event.eventCode },
    });
    modal.present();
    this.statusBarService.show();
    this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
    modal.onDidDismiss().then(res=> {
      this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
    });
  }

  async loadMore() {
    this.pageIndex = this.pageIndex + 1;
    await this.initInterestedEvents();
  }

  async doRefresh(){
    try {
      if(this.isLoading) {
        return;
      }
      this.pageIndex = 0;
      this.pageSize = 10;
      await this.initInterestedEvents(true, true);
    }catch(ex) {
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

  close() {
    this.modal.dismiss();
  }

  async presentAlert(options: any) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }
}
