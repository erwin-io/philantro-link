import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Browser } from '@capacitor/browser';
import { AlertController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';
import { Events } from 'src/app/model/events.model';
import { Transactions } from 'src/app/model/transactions.model';
import { Users } from 'src/app/model/users';
import { TransactionsService } from 'src/app/services/transactions.service';


@Component({
  selector: 'app-donate-form',
  templateUrl: './donate-form.component.html',
  styleUrls: ['./donate-form.component.scss'],
})
export class DonateFormComponent  implements OnInit {
  modal: HTMLIonModalElement;
  currentUser: Users;
  event: Events;
  amountFormControl = new FormControl();
  isSubmitting = false;
  data: {
    transactions: Transactions;
    id?: string;
    checkout_url?: string;
    payment_intent?: {
        id?: string;
        status?: string;
    };
    status?: string;
    paid?: boolean;
  };
  constructor(
    private transactionsService: TransactionsService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    // this.amountFormControl = new FormControl(0, [Validators.required, Validators.min(20)]);
  }

  async onSubmit() {
    try {
      this.isSubmitting = true;
      this.transactionsService.requestPaymentLink({ 
        amount: this.amountFormControl.value, 
        userId: this.currentUser?.userId,
        eventId: this.event?.eventId
      })
        .subscribe(async res=> {
          this.isSubmitting = false;
          if(res.success && res.data) {
            this.data = res.data;
            await Browser.open({ url: res.data?.checkout_url}).then(async ()=> {
              await this.presentAlert({
                header: 'Payment Processing',
                backdropDismiss: false,
                subHeader: 'Your payment link has been opened in a new browser tab. Please proceed to complete the transaction through your wallet account!',
                buttons: [{
                  text: 'OK',
                  handler: async ()=> {
                    await this.checkDonation(res.data?.transactions?.transactionCode);
                  }
                }],
              })
            });
          } else {
            this.isSubmitting = false;
            await this.presentAlert({
              header: 'Oops!',
              message: res?.message??"",
              buttons: ['OK'],
            })
          }
      }, async (err)=> {
        this.isSubmitting = false;
        await this.presentAlert({
          header: 'Error Encountered',
          subHeader: "We're sorry, but there was an issue opening the payment link. Please try again later or contact customer support for assistance!",
          message: err?.message??"",
          buttons: ['OK'],
        })
      });
    } catch(ex) {
      await this.presentAlert({
        header: 'Error Encountered',
        subHeader: "We're sorry, but there was an issue opening the payment link. Please try again later or contact customer support for assistance!",
        message: ex?.message??"",
        buttons: ['OK'],
      })
    }
  }

  async checkDonation(transactionCode) {
    try {
      this.isSubmitting = true;
      this.transactionsService.getByCode(transactionCode)
        .subscribe(async (res: { success: boolean; data: any;})=> {
          if(res?.success && res?.data && res?.data?.paymentData && res?.data?.paymentData?.paid) {
            await this.presentAlert({
              header: 'Transaction Successful',
              backdropDismiss: false,
              subHeader: "Your payment has been successfully processed. Thank you for using our service!",
              buttons: [{
                text: 'OK',
                handler: ()=> {
                  this.modal.dismiss(res?.data, "ok");
                }
              }],
            }).then(res=> {
              this.modal.dismiss({}, "ok");
            }).finally(()=> {
              this.modal.dismiss({}, "ok");
            })
          } else {
            await this.presentAlert({
              header: 'Error Encountered',
              subHeader: "We're sorry, but there was an issue opening the payment link. Please try again later or contact customer support for assistance!",
              buttons: ['OK'],
            })
          }
      }, async (err)=> {
        this.isSubmitting = false;
        await this.presentAlert({
          header: 'Error Encountered',
          subHeader: "We're sorry, but there was an issue opening the payment link. Please try again later or contact customer support for assistance!",
          message: err?.message??"",
          buttons: ['OK'],
        })
      });

    } catch(ex) {
      this.isSubmitting = false;
      await this.presentAlert({
        header: 'Error Encountered',
        subHeader: "We're sorry, but there was an issue opening the payment link. Please try again later or contact customer support for assistance!",
        message: ex?.message??"",
        buttons: ['OK'],
      })
    }
  }

  ionViewWillEnter(){
    console.log('donate form visited');
  }

  async presentAlert(options: AlertOptions) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }

}
