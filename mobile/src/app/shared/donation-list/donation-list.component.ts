import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonRefresher, ModalController } from '@ionic/angular';
import { Transactions } from 'src/app/model/transactions.model';
import { Users } from 'src/app/model/users';
import { AnimationService } from 'src/app/services/animation.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PageLoaderService } from 'src/app/services/page-loader.service';
import { StatusBarService } from 'src/app/services/status-bar.service';
import { StorageService } from 'src/app/services/storage.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { UserConversationService } from 'src/app/services/user-conversation.service';
import { DonationDetailsComponent } from '../donation-details/donation-details.component';
import { getPersonDefaultImage } from '../utility/utility';
import { Events } from 'src/app/model/events.model';
import { DonateFormComponent } from '../donate-form/donate-form.component';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss'],
})
export class DonationListComponent  implements OnInit {
  modal: HTMLIonModalElement;
  event: Events;
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
      const [paginated, event, _unReadMessage, _unReadNotif] = await Promise.all([
        this.supportTicketService.getByAdvanceSearch({
          order: { transactionId: "DESC" },
          columnDef: [{
            apiNotation: "event.eventCode",
            filter: this.event?.eventCode,
            type: "precise"
          } as any],
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).toPromise(),
        this.eventsService.getByCode(this.event?.eventCode, this.currentUser?.userCode).toPromise(),
        this.userConversationService.getUnreadByUser(this.currentUser?.userId).toPromise(),
        this.notificationService.getUnreadByUser(this.currentUser?.userId).toPromise()
      ]);

      if(paginated.data.results) {
        this.transactions = [ ...this.transactions, ...paginated.data.results ];
        this.total = paginated.data.total;
      }

      if(event) {
        this.event.raisedDonation = event?.data?.raisedDonation;
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

  imageErrorHandler(event) {
    event.target.src = getPersonDefaultImage(null);
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

  async onDonate() {
    try {
      const actionSheet = await this.actionSheetController.create({
        header: 'Do you want to donate to this event?',
        buttons: [
          {
            text: "Yes, proceed please",
            handler: async () => {
              let modal: HTMLIonModalElement = null;
              modal = await this.modalCtrl.create({
                component: DonateFormComponent,
                cssClass: 'modal-fullscreen',
                backdropDismiss: false,
                canDismiss: true,
                enterAnimation: this.animationService.pushLeftAnimation,
                leaveAnimation: this.animationService.leavePushLeftAnimation,
                componentProps: { 
                  modal, 
                  event: this.event, 
                  currentUser: this.currentUser
                 },
              });
              modal.present();
              modal.onDidDismiss().then(res=> {
                if(res.role && res.role === "ok") {
                  this.initTransactions(true, true);
                }
              });
            },
          },
          {
            text: 'No',
            cssClass: 'close dismiss cancel',
            handler: async () => {
              actionSheet.dismiss();
            },
          },
        ],
      });
      await actionSheet.present();
    } catch(ex) {
      this.isLoading = false;
      this.presentAlert({
        header: 'Try Again!',
        subHeader: 'There was an error when marking as going!',
        message: ex.message,
        cssClass: 'alert-danger',
        buttons: ['OK'],
      })
    }
  }

  getDonationPercentage(event: Events) {
    if(event && !isNaN(Number(event?.raisedDonation)) && !isNaN(Number(event?.donationTargetAmount))) {
      // return (100 * Number(event?.raisedDonation)) / Number(event?.donationTargetAmount);
      const percent = ((Number(event?.raisedDonation) / Number(event?.donationTargetAmount)) * 100);
      return percent > 0.5 ? percent / 100 : percent;
    } else {
      return 0;
    }
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
