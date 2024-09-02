import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Observable, Subject, of } from 'rxjs';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Users } from 'src/app/model/users';
import { AnimationService } from 'src/app/services/animation.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { PageLoaderService } from 'src/app/services/page-loader.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit {
  modal: HTMLIonModalElement;
  form: FormGroup;
  currentUser: Users;
  isSubmitting = false;
  isEditMode = false;
  isOpenResultModal = false;
  resultModal: {
    type: 'success' | 'failed' | 'warning';
    title: string;
    desc: string;
    done?;
    retry?;
  };
  isLoadingProfile = false;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private appconfig: AppConfigService,
    private authService: AuthService,
    private userService: UserService,
    private animationService: AnimationService,
    private router: Router,
    private storageService: StorageService,
    private pageLoaderService: PageLoaderService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    public toastController: ToastController
  ) {}

  get formData() {
    return this.form.value;
  }

  get isFormDirty() {
    return (
      this.currentUser.name !== this.formData.name ||
      this.currentUser.email !== this.formData.email
    );
  }

  get formControls() {
    return this.form.controls;
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.currentUser?.name),
      email: new FormControl(this.currentUser?.email),
      helpNotifPreferences: new FormControl(this.currentUser?.helpNotifPreferences??[]),
    });
  }

  async onOpenFile(item) {
    window.location.href = item.url;
  }

  getError(key: string) {
    return this.form.controls[key];
  }

  async onSubmit() {
    if (!this.form.valid) {
      return;
    }
    const param = this.form.value;
    const logoutSheet = await this.actionSheetController.create({
      cssClass: 'app-action-sheet',
      header: 'Are you sure you want to update your account?',
      buttons: [
        {
          text: 'Yes?',
          handler: async () => {
            try {
              this.isSubmitting = true;
              await this.pageLoaderService.open('Processing please wait...');
              const res: ApiResponse<Users> = await this.userService
                .updateProfile(this.currentUser.userCode, param)
                .toPromise()

              if (res.success) {
                this.ngUnsubscribe.complete();
                await this.pageLoaderService.close();
                this.isSubmitting = false;
                this.isOpenResultModal = true;
                this.resultModal = {
                  title: 'Success!',
                  desc: 'Account successfully updated!',
                  type: 'success',
                  done: ()=> {
                    this.isOpenResultModal = false;
                    this.isEditMode = false;
                    // this.modal.dismiss(res.data, 'confirm');
                  }
                };
                this.isEditMode = false;
                this.storageService.saveTotalUnreadNotif(res.data["totalUnreadNotif"]);
                this.currentUser = res.data;
                this.storageService.saveLoginProfile(this.currentUser);
              } else {
                await this.pageLoaderService.close();
                this.ngUnsubscribe.complete();
                this.isSubmitting = false;
                this.isOpenResultModal = true;
                this.resultModal = {
                  title: 'Error!',
                  desc: 'Oops, ' + res.message,
                  type: 'failed',
                  retry: ()=> {
                    this.isOpenResultModal = false;
                  },
                };
              }
            } catch (e) {
              await this.pageLoaderService.close();
              this.ngUnsubscribe.complete();
              this.isSubmitting = false;
              this.isOpenResultModal = true;
              this.resultModal = {
                title: 'Oops!',
                desc: Array.isArray(e.message) ? e.message[0] : e.message,
                type: 'failed',
                retry: () => {
                  this.isOpenResultModal = false;
                },
              };
            }
          },
        },
        {
          text: 'No',
          handler: async () => {
            logoutSheet.dismiss();
          },
        },
      ],
    });
    logoutSheet.present();
  }

  async uploadFile(event) {
    try {

      if(event?.target?.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          let files = this.form.controls['requirements']?.value && this.form.controls['requirements']?.value?.length > 0 ? this.form.controls['requirements'].value : [];

          files.push({
            fileName: file.name,
            base64: reader.result.toString().split(",")[1],
          });

          files = files.map((f, i) => {
            return {
              base64: f.base64,
              fileName: f.fileName,
              id: i
            }
          });
          this.form.controls['requirements'].setValue(files);
          this.form.controls['requirements'].markAsDirty();
          this.form.controls['requirements'].markAllAsTouched();
          this.form.controls['requirements'].updateValueAndValidity();
        }
      }
    } catch(ex) {
      const alert = await this.alertController.create({
        message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
      });
      alert.present();
    }
  }

  async onSelectUploaded(item: { id: string; fileName: string}) {
    const logoutSheet = await this.actionSheetController.create({
      cssClass: 'app-action-sheet',
      header: `Do you want to remove ${item.fileName}?`,
      buttons: [
        {
          text: 'Yes?',
          handler: async () => {
            const files = this.form.controls.requirements.value;
            const newFiles = files.filter(x=>x.id !== item.id).map((f, i) => {
              return {
                base64: f.base64,
                fileName: f.fileName,
                id: i
              }
            });
            this.form.controls.requirements.setValue(newFiles);
            logoutSheet.dismiss();
          },
        },
        {
          text: 'No',
          handler: async () => {
            logoutSheet.dismiss();
          },
        },
      ],
    });
    logoutSheet.present();

  }

  isAssistanceItemSelected(helpType) {
    const items: string[] = this.formData.helpNotifPreferences;
    return items.some(x=> x.toString().toLowerCase() === helpType.toString().toLowerCase());
  }

  selectAssistanceItem(helpType) {
    let items: string[] = this.formData.helpNotifPreferences
    if(!this.isAssistanceItemSelected(helpType)) {
      items.push(helpType);
    } else {
      items = items.filter(x=> x.toString().toLowerCase() !== helpType.toString().toLowerCase());
    }
    this.form.controls.helpNotifPreferences.setValue(items);
    this.form.controls.helpNotifPreferences.markAsDirty();
    this.form.controls.helpNotifPreferences.markAsTouched();
  }

  handleError<T>(operation, result?: T) {
    return (error: any): Observable<T> => {
      this.ngUnsubscribe.complete();
      this.log(
        `${operation} failed: ${
          Array.isArray(error.message) ? error.message[0] : error.message
        }`
      );
      return of(error as any);
    };
  }

  log(message: string) {
    this.resultModal = {
      title: 'Oops!',
      desc: message,
      type: 'failed',
      retry: () => {
        this.isOpenResultModal = false;
      },
    };
  }

  async presentAlert(options: any) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }
}
