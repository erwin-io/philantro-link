import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonRefresher, ModalController } from '@ionic/angular';
import { Transactions } from 'src/app/model/transactions.model';
import { Users } from 'src/app/model/users';
import { AnimationService } from 'src/app/services/animation.service';
import { AuthService } from 'src/app/services/auth.service';
import { PageLoaderService } from 'src/app/services/page-loader.service';
import { StatusBarService } from 'src/app/services/status-bar.service';
import { StorageService } from 'src/app/services/storage.service';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
  selector: 'app-donation-details',
  templateUrl: './donation-details.component.html',
  styleUrls: ['./donation-details.component.scss'],
})
export class DonationDetailsComponent  implements OnInit {
  modal: HTMLIonModalElement;
  currentUser: Users;
  transaction: Transactions;
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  isLoading = false;
  isProcessing = false;
  showError = false;
  constructor(
    private statusBarService: StatusBarService,
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private supportTicketService: TransactionsService,
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
      this.supportTicketService.getByCode(this.transaction?.transactionCode).subscribe(res=> {
        this.transaction = res.data;
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
