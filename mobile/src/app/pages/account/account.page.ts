/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { Platform, ActionSheetController, ModalController, AlertController } from '@ionic/angular';
import { Users } from 'src/app/model/users';
import { AnimationService } from 'src/app/services/animation.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { UserService } from 'src/app/services/user.service';
import { StatusBarService } from 'src/app/services/status-bar.service';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ResetPasswordComponent } from '../../shared/reset-password/reset-password.component';
import { Capacitor } from '@capacitor/core';
import { HelpSupportComponent } from 'src/app/shared/help-support/help-support.component';
import { MyDonationComponent } from 'src/app/shared/my-donation/my-donation.component';
import { base64ToBlob, createDataURL, getFileExtension, getPersonDefaultImage, isBase64, readAsBase64 } from 'src/app/shared/utility/utility';
import { PageLoaderService } from 'src/app/services/page-loader.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  currentUser: Users;
  profilePicSource;
  isSubmitting = false;
  constructor(
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private userService: UserService,
    private animationService: AnimationService,
    private storageService: StorageService,
    private pageLoaderService: PageLoaderService,
    private alertController: AlertController,
    private statusBarService: StatusBarService
  ) {
    this.currentUser = this.storageService.getLoginProfile();

  }

  get totalUnreadNotification() {
    const total = this.storageService.getTotalUnreadNotif();
    return total && !isNaN(Number(total)) ? Number(total) : 0;
  }
  ngOnInit() {
  }

  ionViewWillEnter(){
    this.statusBarService.overLay(false);
    this.statusBarService.show(true);
    this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
  }

  async onOpenAccountSettings() {
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: AccountSettingsComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.flyUpAnimation,
      leaveAnimation: this.animationService.leaveFlyUpAnimation,
      componentProps: { modal, currentUser: this.currentUser },
    });
    modal.present();
    this.statusBarService.show();
    this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
    modal.onWillDismiss().then(()=> {
      this.currentUser = this.storageService.getLoginProfile();
      this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
    })
  }

  async onOpenMyDonation() {
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: MyDonationComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.flyUpAnimation,
      leaveAnimation: this.animationService.leaveFlyUpAnimation,
      componentProps: { modal, currentUser: this.currentUser },
    });
    modal.present();
    this.statusBarService.show();
    this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
    modal.onWillDismiss().then(()=> {
      this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
    })
  }

  async onOpenResetPassword() {
    
    let modal!: HTMLIonModalElement;
    modal = await this.modalCtrl.create({
      component: ResetPasswordComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.flyUpAnimation,
      leaveAnimation: this.animationService.leaveFlyUpAnimation,
      componentProps: { modal, title: "Reset Password", headerColor: "primary" },
    });
    this.statusBarService.show();
    this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
    modal.present();
    modal.onDidDismiss().then(async ()=> {
      this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
    });
  }

  async onOpenHelpSupport() {
    let modal!: HTMLIonModalElement;
    modal = await this.modalCtrl.create({
      component: HelpSupportComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.flyUpAnimation,
      leaveAnimation: this.animationService.leaveFlyUpAnimation,
      componentProps: { modal },
    });
    this.statusBarService.show();
    this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
    modal.present();
    modal.onDidDismiss().then(async ()=> {
      this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
    });
  }

  async signout() {
    const logoutSheet = await this.actionSheetController.create({
      cssClass: 'app-action-sheet',
      header: 'Do you want to logout?',
      buttons: [
        {
          text: 'Yes?',
          handler: async () => {
            this.authService.logout();
            logoutSheet.dismiss();
          },
        },
        {
          text: 'No',
          cssClass: 'close dismiss cancel',
          handler: async () => {
            logoutSheet.dismiss();
          },
        },
      ],
    });
    logoutSheet.present();
  }

  async onShowChangeProfilePicMenu() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Need a refresh? Tap here to change your profile picture.',
      cssClass: 'sched-card-action-sheet',
      buttons: [
        {
          text: 'Camera',
          handler: async () => {
            const image = await Camera.getPhoto({
              quality: 90,
              allowEditing: false,
              resultType: CameraResultType.Uri,
              source: CameraSource.Camera, // Camera, Photos or Prompt!
            });
            if (image) {
                
              const data = await readAsBase64(image, this.platform.is('hybrid'));
              const mimeType = data.toString().match(/data:(.*?);base64/)?.[1] || '';
              const blob = await base64ToBlob(this.platform.is('hybrid') ? data : data.toString().split(',')[1] as any , this.platform.is('hybrid') ? `image/${image.format}` : mimeType);
              if(blob.size > 4 * 1024 * 1024) {
                this.presentAlert({
                  header: 'Try Again!',
                  subHeader: 'There was an error when uploading your image, please try again!',
                  message: "Image size exceeds the limit of 4MB.",
                  cssClass: 'alert-danger',
                  buttons: ['OK'],
                })
              } else {
                const fileExtension = this.platform.is('hybrid') ? image.format : getFileExtension(data);
                this.profilePicSource = this.platform.is('hybrid') ? createDataURL(data as any, fileExtension) : data as any;
                await this.saveProfilePicture(
                  {
                    userProfilePic: {
                      fileName: `profile-sample-name.${image.format}`,
                      data: isBase64(data.toString()) ? data : data.toString().split(',')[1]
                    }
                  });
              }
            }
            actionSheet.dismiss();
          },
        },
        {
          text: 'Gallery',
          handler: async () => {
            const image = await Camera.getPhoto({
              quality: 90,
              allowEditing: false,
              resultType: CameraResultType.Uri,
              source: CameraSource.Photos, // Camera, Photos or Prompt!
            });
            if (image) {
                
              const data = await readAsBase64(image, this.platform.is('hybrid'));
              const mimeType = data.toString().match(/data:(.*?);base64/)?.[1] || '';
              const blob = await base64ToBlob(this.platform.is('hybrid') ? data : data.toString().split(',')[1] as any , this.platform.is('hybrid') ? `image/${image.format}` : mimeType);
              if(blob.size > 4 * 1024 * 1024) {
                this.presentAlert({
                  header: 'Try Again!',
                  subHeader: 'There was an error when uploading your image, please try again!',
                  message: "Image size exceeds the limit of 4MB.",
                  cssClass: 'alert-danger',
                  buttons: ['OK'],
                })
              } else {
                const fileExtension = this.platform.is('hybrid') ? image.format : getFileExtension(data);
                this.profilePicSource = this.platform.is('hybrid') ? createDataURL(data as any, fileExtension) : data as any;;
                await this.saveProfilePicture(
                  {
                    userProfilePic: {
                      fileName: `profile-sample-name.${image.format}`,
                      data: isBase64(data.toString()) ? data : data.toString().split(',')[1]
                    }
                  });
              }
            }
            actionSheet.dismiss();
          },
        },
        {
          text: 'Cancel',
          handler: async () => {
            actionSheet.dismiss();
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async saveProfilePicture(params) {
    try {
      this.isSubmitting = true;
      await this.pageLoaderService.open('Processing please wait...');
      this.userService.updateProfilePicture(this.currentUser.userCode, params).subscribe(
        async (res) => {
          this.pageLoaderService.close();
          if (res.success) {
            this.isSubmitting = false;
            this.currentUser.userProfilePic = res.data.userProfilePic;
            this.storageService.saveLoginProfile(this.currentUser);
          } else {
            this.isSubmitting = false;
            await this.presentAlert({
              header: 'Try again!',
              message: Array.isArray(res.message)
                ? res.message[0]
                : res.message,
              buttons: ['OK'],
            });
          }
        },
        async (err) => {
          this.pageLoaderService.close();
          this.isSubmitting = false;
          await this.presentAlert({
            header: 'Try again!',
            message: Array.isArray(err.message) ? err.message[0] : err.message,
            buttons: ['OK'],
          });
        }
      );
    } catch (e) {
      this.pageLoaderService.close();
      this.isSubmitting = false;
      await this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(e.message) ? e.message[0] : e.message,
        buttons: ['OK'],
      });
    }
  }

  async presentAlert(options: any) {
    const alert = await this.alertController.create(options);
    return await alert.present();
  }

  profilePicErrorHandler(event) {
    event.target.src = getPersonDefaultImage(null);
  }
}
