import { Component, OnInit, ViewChild } from '@angular/core';
import { Transactions } from 'src/app/model/transactions.model';
import { Users } from 'src/app/model/users';
import { getEventCardDefaultImage } from '../utility/utility';
import { IonRefresher, ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { Events } from 'src/app/model/events.model';
import { AnimationService } from 'src/app/services/animation.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventsService } from 'src/app/services/events.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PageLoaderService } from 'src/app/services/page-loader.service';
import { StatusBarService } from 'src/app/services/status-bar.service';
import { StorageService } from 'src/app/services/storage.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { UserConversationService } from 'src/app/services/user-conversation.service';
import { DonateFormComponent } from '../donate-form/donate-form.component';
import { DonationDetailsComponent } from '../donation-details/donation-details.component';
import { Style } from '@capacitor/status-bar';
import { EventDetailsComponent } from '../event-details/event-details.component';

@Component({
  selector: 'app-my-donation',
  templateUrl: './my-donation.component.html',
  styleUrls: ['./my-donation.component.scss'],
})
export class MyDonationComponent  implements OnInit {
  modal: HTMLIonModalElement;
  currentUser: Users;
  transactions: Transactions[] = [];
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
    private supportTicketService: TransactionsService,
    private notificationService: NotificationService,
    private eventsService: EventsService,
    private userConversationService: UserConversationService,
    private pageLoaderService: PageLoaderService,
    private animationService: AnimationService,
    private authService: AuthService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,) { 
      this.currentUser = this.storageService.getLoginProfile();
    }
  get isAuthenticated() {
    return this.currentUser && this.currentUser.userCode;
  }
  ngOnInit() {
    if(this.isAuthenticated) {
      this.pageIndex = 0;
      this.pageSize = 10;
      this.initTransactions(true, true);
    }
  }

  async initTransactions(showProgress = false, clear = false) {
    try {
      if(clear) {
        this.transactions = [];
      }
      this.isLoading = showProgress;
      const [paginated, _unReadMessage, _unReadNotif] = await Promise.all([
        this.supportTicketService.getByAdvanceSearch({
          order: { transactionId: "DESC" },
          columnDef: [{
            apiNotation: "user.userCode",
            filter: this.currentUser?.userCode,
            type: "precise"
          } as any, {
            apiNotation: "status",
            filter: "COMPLETED",
            type: "precise" 
          }],
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).toPromise(),
        this.userConversationService.getUnreadByUser(this.currentUser?.userId).toPromise(),
        this.notificationService.getUnreadByUser(this.currentUser?.userId).toPromise()
      ]);

      if(paginated.data.results) {
        this.transactions = [ ...this.transactions, ...paginated.data.results ];
        this.total = paginated.data.total;
      }

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

  imageErrorHandler(event, type: "CHARITY" | "VOLUNTEER" | "DONATION" | "ASSISTANCE") {
    event.target.src = getEventCardDefaultImage(type);
  }

  ionViewWillEnter(){
  }

  async onOpenDonation(transactions: Transactions) {
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: DonationDetailsComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal, transactions, },
    });
    modal.present();
    modal.onDidDismiss().then((res: {data: Transactions; role})=> {
    });
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

  async loadMore() {
    this.pageIndex = this.pageIndex + 1;
    await this.initTransactions();
  }

  async doRefresh(){
    try {
      if(this.isLoading) {
        return;
      }
      this.pageIndex = 0;
      this.pageSize = 10;
      await this.initTransactions(true, true);
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
