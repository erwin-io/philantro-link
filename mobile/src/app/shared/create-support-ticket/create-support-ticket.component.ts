import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { ApiResponse } from 'src/app/model/api-response.model';
import { SupportTicket } from 'src/app/model/support-ticket.model';
import { Users } from 'src/app/model/users';
import { AnimationService } from 'src/app/services/animation.service';
import { AuthService } from 'src/app/services/auth.service';
import { PageLoaderService } from 'src/app/services/page-loader.service';
import { StatusBarService } from 'src/app/services/status-bar.service';
import { StorageService } from 'src/app/services/storage.service';
import { SupportTicketService } from 'src/app/services/support-ticket.service';

@Component({
  selector: 'app-create-support-ticket',
  templateUrl: './create-support-ticket.component.html',
  styleUrls: ['./create-support-ticket.component.scss'],
})
export class CreateSupportTicketComponent  implements OnInit {
  modal: HTMLIonModalElement;
  currentUser: Users;
  isLoading = false;
  isSubmitting = false;
  showError = false;

  form: FormGroup;
  constructor(
    private supportTicketService: SupportTicketService,
    private statusBarService: StatusBarService,
    private modalCtrl: ModalController,
    private pageLoaderService: PageLoaderService,
    private animationService: AnimationService,
    private authService: AuthService,
    private actionSheetController: ActionSheetController,
    private storageService: StorageService,
    private alertController: AlertController) { 
      this.currentUser = this.storageService.getLoginProfile();
    }

  get isAuthenticated() {
    return this.currentUser && this.currentUser.userCode;
  }
  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      dateTimeSent: new FormControl(moment().format("YYYY-MM-DD HH:mm:ss")),
      type: new FormControl(null, [Validators.required]),
      userCode: new FormControl(this.currentUser.userCode)
    });
  }

  get isFormValid() {
    return this.form.valid;
  }

  get formValue() {
    return this.form.value;
  }

  async onSubmit() {
    try {
      const formValue = this.formValue;
      const actionSheet = await this.actionSheetController.create({
        header: "Do you want to submit this report?",
        subHeader: "By continuing, you agree to our Terms of Service and Privacy Policy",
        buttons: [
          {
            text: "Yes, save it",
            handler: async () => {
              try {
                await this.pageLoaderService.open('Please wait...');
                this.isSubmitting = true;
                this.isLoading = true;
                const res = await this.supportTicketService.create(formValue).toPromise();
                await this.pageLoaderService.close();
                this.isSubmitting = false;
                if(res.success && res.data) {
                  this.presentAlert({
                    header: 'Success!',
                    backdropDismiss: false,
                    message: `Report submitted successfully!`,
                    buttons: [{
                      text: 'OK',
                      handler: ()=> {
                        this.modal.dismiss(res.data, "ok");
                      }
                    }]
                  });
                } else {
                  this.presentAlert({
                    header: 'Try again!',
                    message: Array.isArray(res.message) ? res.message[0] : res.message,
                    buttons: ['OK']
                  });
                }
              } catch(ex) {
                this.isSubmitting = false;
                this.isLoading = false;
                this.presentAlert({
                  header: 'Try again!',
                  message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
                  buttons: ['OK']
                });
              }
            },
          },
          {
            text: 'Cancel',
            cssClass: 'close dismiss cancel',
            handler: async () => {
              actionSheet.dismiss();
            },
          },
        ],
      });
      actionSheet.present();
    } catch (e) {
      this.isSubmitting = false;
      this.isLoading = false;
      this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(e.message) ? e.message[0] : e.message,
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
