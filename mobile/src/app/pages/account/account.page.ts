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
              const base64Data = await this.readAsBase64(image);
              this.profilePicSource = base64Data;
              await this.saveProfilePicture(
                {
                  userId: this.currentUser.userId,
                  userProfilePic: {
                    fileName: `profile-sample-name.${image.format}`,
                    data: base64Data,
                  }
                });
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
              const base64Data = await this.readAsBase64(image);
              this.profilePicSource = base64Data;
              await this.saveProfilePicture(
                {
                  userId: this.currentUser.userId,
                  userProfilePic: {
                    fileName: `profile-sample-name.${image.format}`,
                    data: base64Data,
                  }
                });
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
      // this.userService.updateProfilePicture(this.currentUser.userCode, params).subscribe(
      //   async (res) => {
      //     if (res.success) {
      //       this.isSubmitting = false;
      //       this.currentUser.userProfilePic = res.data.userProfilePic;
      //       this.storageService.saveLoginProfile(this.currentUser);
      //     } else {
      //       this.isSubmitting = false;
      //       await this.presentAlert({
      //         header: 'Try again!',
      //         message: Array.isArray(res.message)
      //           ? res.message[0]
      //           : res.message,
      //         buttons: ['OK'],
      //       });
      //     }
      //   },
      //   async (err) => {
      //     this.isSubmitting = false;
      //     await this.presentAlert({
      //       header: 'Try again!',
      //       message: Array.isArray(err.message) ? err.message[0] : err.message,
      //       buttons: ['OK'],
      //     });
      //   }
      // );
    } catch (e) {
      this.isSubmitting = false;
      await this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(e.message) ? e.message[0] : e.message,
        buttons: ['OK'],
      });
    }
  }

  async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path,
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      const base64 = (await this.convertBlobToBase64(blob)) as string;
      return base64.split(',')[1];
    }
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  async presentAlert(options: any) {
    const alert = await this.alertController.create(options);
    return await alert.present();
  }

  profilePicErrorHandler(event) {
    return '../../../assets/img/person.png';
  }
}
