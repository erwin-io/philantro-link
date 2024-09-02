import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRefresher, ModalController, AlertController } from '@ionic/angular';
import { SupportTicket } from 'src/app/model/support-ticket.model';
import { Users } from 'src/app/model/users';
import { MessageDetailsPage } from 'src/app/pages/message/message-details/message-details.page';
import { AnimationService } from 'src/app/services/animation.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PageLoaderService } from 'src/app/services/page-loader.service';
import { StatusBarService } from 'src/app/services/status-bar.service';
import { StorageService } from 'src/app/services/storage.service';
import { SupportTicketService } from 'src/app/services/support-ticket.service';
import { UserConversationService } from 'src/app/services/user-conversation.service';

@Component({
  selector: 'app-support-ticket-details',
  templateUrl: './support-ticket-details.component.html',
  styleUrls: ['./support-ticket-details.component.scss'],
})
export class SupportTicketDetailsComponent  implements OnInit {
  modal: HTMLIonModalElement;
  currentUser: Users;
  supportTicket: SupportTicket;
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  isLoading = false;
  isProcessing = false;
  showError = false;
  constructor(
    private statusBarService: StatusBarService,
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private supportTicketService: SupportTicketService,
    private pageLoaderService: PageLoaderService,
    private animationService: AnimationService,
    private authService: AuthService,
    private alertController: AlertController) { 
      this.currentUser = this.storageService.getLoginProfile();
    }

  get isAuthenticated() {
    return this.currentUser && this.currentUser.userCode;
  }
  async ngOnInit() {
    try {
      this.isLoading = true;
      this.supportTicketService.getByCode(this.supportTicket?.supportTicketCode, this.currentUser?.userCode).subscribe(res=> {
        this.supportTicket = res.data;
        this.isLoading = false;
        if(this.ionRefresher) {
          this.ionRefresher.complete();
        }
      }, async (err)=> {
        this.isLoading = false;
        this.showError = true;
        if(this.ionRefresher) {
          this.ionRefresher.complete();
        }
        await this.presentAlert({
          header: 'Try again!',
          message: Array.isArray(err.message) ? err.message[0] : err.message,
          buttons: ['OK']
        });
      });
    } catch(ex) {
      this.isLoading = false;
      this.showError = true;
      await this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
        buttons: ['OK']
      });
    }
  }

  async onOpenChat() {
    this.modal.dismiss();
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: MessageDetailsPage,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal, userConversation: {
        ...this.supportTicket?.userConversation,
        supportTicket: this.supportTicket,
      }, currentUser: this.currentUser, type: "SUPPORT_TICKET", refererPage: "SUPPORT_DETAILS" },
    });
    modal.present();
    modal.onDidDismiss().then(async (res: {data: SupportTicket; role})=> {
      try {
        // const res = await this.supportTicketService.getByCode(this.supportTicket?.supportTicketCode, this.currentUser?.userCode).toPromise();
        // this.event.visitorUnReadMessage = res.data.visitorUnReadMessage;
        // this.event.visitorUserConversation = res.data.visitorUserConversation;
      } catch(ex) {
        this.isLoading = false;
        this.showError = true;
        await this.presentAlert({
          header: 'Try again!',
          message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
          buttons: ['OK']
        });
      }
    });
  }

  async doRefresh() {
    try {
      if(this.isLoading) {
        return;
      }
      this.ngOnInit();
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

  close() {
    this.modal.dismiss();
  }

  async presentAlert(options: any) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }

}
