import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonRefresher, ModalController } from '@ionic/angular';
import { getEventCardDefaultImage } from '../utility/utility';
import { Users } from 'src/app/model/users';
import { SupportTicket } from 'src/app/model/support-ticket.model';
import { Style } from '@capacitor/status-bar';
import { StatusBarService } from 'src/app/services/status-bar.service';
import { AnimationService } from 'src/app/services/animation.service';
import { AuthService } from 'src/app/services/auth.service';
import { PageLoaderService } from 'src/app/services/page-loader.service';
import { StorageService } from 'src/app/services/storage.service';
import { SupportTicketService } from '../../services/support-ticket.service';
import { UserConversationService } from 'src/app/services/user-conversation.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CreateSupportTicketComponent } from '../create-support-ticket/create-support-ticket.component';
import { SupportTicketDetailsComponent } from '../support-ticket-details/support-ticket-details.component';

@Component({
  selector: 'app-help-support',
  templateUrl: './help-support.component.html',
  styleUrls: ['./help-support.component.scss'],
})
export class HelpSupportComponent  implements OnInit {
  modal: HTMLIonModalElement;
  currentUser: Users;
  supportTickets: SupportTicket[] = [];
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
    private supportTicketService: SupportTicketService,
    private pageLoaderService: PageLoaderService,
    private animationService: AnimationService,
    private authService: AuthService,
    private userConversationService: UserConversationService,
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
      this.initSupportTickets(true, true);
    }
  }

  imageErrorHandler(event) {
    event.target.src = getEventCardDefaultImage(null);
  }

  ionViewWillEnter(){
  }

  async initSupportTickets(showProgress = false, clear = false) {
    try {
      if(clear) {
        this.supportTickets = [];
      }
      this.isLoading = showProgress;
      const [paginated, _unReadMessage, _unReadNotif] = await Promise.all([
        this.supportTicketService.getByAdvanceSearch({
          order: { supportTicketId: "DESC" },
          columnDef: [{
            apiNotation: "user.userId",
            filter: this.currentUser?.userId,
            type: "precise"
          } as any],
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).toPromise(),
        this.userConversationService.getUnreadByUser(this.currentUser?.userId).toPromise(),
        this.notificationService.getUnreadByUser(this.currentUser?.userId).toPromise()
      ]);

      if(paginated.data.results) {
        this.supportTickets = [ ...this.supportTickets, ...paginated.data.results ];
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

  async onOpenTicket(supportTicket: SupportTicket) {
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: SupportTicketDetailsComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal, supportTicket, },
    });
    modal.present();
    modal.onDidDismiss().then((res: {data: SupportTicket; role})=> {
      if(res.role === "ok" && this.supportTickets.some(x=>x.supportTicketCode === supportTicket?.supportTicketCode)) {
        this.supportTickets.find(x=>x.supportTicketCode === supportTicket?.supportTicketCode).status = res.data.status;
      }
    });
  }
  
  async onOpenCreateSupportTicket() {
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: CreateSupportTicketComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal},
    });
    this.statusBarService.show();
    this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
    modal.present();
    modal.onDidDismiss().then(res=> {
      this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
      if(res?.role === "ok" && res?.data) {
        this.pageIndex = 0;
        this.pageSize = 10;
        this.initSupportTickets(true, true);
      }
    });
  }

  async loadMore() {
    this.pageIndex = this.pageIndex + 1;
    await this.initSupportTickets();
  }

  async doRefresh(){
    try {
      if(this.isLoading) {
        return;
      }
      this.pageIndex = 0;
      this.pageSize = 10;
      await this.initSupportTickets(true, true);
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
