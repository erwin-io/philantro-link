import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ModalController } from '@ionic/angular';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { Users } from 'src/app/model/users';
import { AnimationService } from 'src/app/services/animation.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { PageLoaderService } from 'src/app/services/page-loader.service';
import { StatusBarService } from 'src/app/services/status-bar.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserOneSignalSubscriptionService } from 'src/app/services/user-one-signal-subscription.service';
import { ResetPasswordComponent } from '../../../shared/reset-password/reset-password.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  modal;
  isSubmitting = false;
  logInForm = new FormGroup({
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });
  error;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private modalCtrl: ModalController,
    private appconfig: AppConfigService,
    private pageLoaderService: PageLoaderService,
    private storageService: StorageService,
    private userOneSignalSubscriptionService: UserOneSignalSubscriptionService,
    private authService: AuthService,
    private statusBarService: StatusBarService,
    private animationService: AnimationService,
    private formBuilder: FormBuilder) {
      window.addEventListener("deviceorientation", (e)=> {
      }, true);
    }

  async ngOnInit() {
    this.ngUnsubscribe.next();
    // This completes the subject properlly.
    this.ngUnsubscribe.complete();
    setTimeout(()=> {
      this.logInForm.markAsDirty();
      this.logInForm.markAsPristine();
      this.logInForm.reset();
    }, 500);

  }

  public ngOnDestroy(): void {
      // This aborts all HTTP requests.
      this.ngUnsubscribe.next();
      // This completes the subject properlly.
      this.ngUnsubscribe.complete();
  }

  async onLogin() {
    this.error = null;
    try {
      this.logInForm.markAllAsTouched();
      if(this.logInForm.valid && !this.logInForm.invalid ) {
        const formData = this.logInForm.value;
        this.isSubmitting = true;
        await this.pageLoaderService.open('Please wait...');
        this.authService.loginClient({
          userName: formData.email,
          password: formData.password,
        }).pipe(
          takeUntil(this.ngUnsubscribe),
          catchError(this.handleError('login', []))
        ).subscribe(async res=> {
          if(res.success) {
            this.storageService.saveTotalUnreadNotif(res.data?.totalUnreadNotif);
            const user: Users = res.data;
            this.storageService.saveLoginProfile(user);
            const subscriptionId = this.storageService.getOneSignalSubscriptionId();
            if(subscriptionId && subscriptionId !== '' && subscriptionId !== null && !subscriptionId?.toString().includes('null')) {
              await this.userOneSignalSubscriptionService.create({
                userId: res.data.user?.userId,
                subscriptionId
              }).toPromise().catch(async (firebaseRes: any)=> {
                await this.pageLoaderService.close();
                this.isSubmitting = false;
              }).finally(() => {
                setTimeout(async ()=> {
                  this.statusBarService.overLay(false);
                  this.statusBarService.show(true);
                  this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
                  await this.pageLoaderService.close();
                  this.isSubmitting = false;
                  window.location.href = '/home';
                }, 2000);
              });
            } else {
              setTimeout(async ()=> {
                this.statusBarService.overLay(false);
                this.statusBarService.show(true);
                this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
                await this.pageLoaderService.close();
                this.isSubmitting = false;
                window.location.href = '/home';
              }, 2000);
            }
          } else {
            this.error = res.message.toString();
            await this.pageLoaderService.close();
            this.isSubmitting = false;
          }

          this.ngUnsubscribe.next();
          this.ngUnsubscribe.complete();
        }, async (err)=> {

          this.error = err?.message ? err?.message.toString() : err?.toString();
          await this.pageLoaderService.close();
          this.isSubmitting = false;
          this.ngUnsubscribe.next();
          this.ngUnsubscribe.complete();
        }, async ()=> {
          this.ngUnsubscribe.next();
          this.ngUnsubscribe.complete();
        });
      }
    } catch(ex) {
      this.error = ex?.message ? ex?.message.toString() : ex?.toString();
      await this.pageLoaderService.close();
      this.isSubmitting = false;
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }
  }

  getError(key): ValidationErrors {
    if(this.logInForm?.controls[key]?.touched && ( this.logInForm.controls[key]?.dirty || this.logInForm.controls[key]?.invalid || !this.logInForm.controls[key]?.valid)) {
      return this.logInForm?.controls[key]?.errors;
    }
    else {
      return null;
    }
  }

  async onShowResetPasswordDialog() {
    let modal!: HTMLIonModalElement;
    modal = await this.modalCtrl.create({
      component: ResetPasswordComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal, isFromLandingPage: true },
    });
    modal.onDidDismiss().then(async ()=> {
      this.logInForm.reset();
    });
    // this.statusBarService.show();
    // this.statusBarService.overLay(false);
    // this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
    modal.present();
  }

  handleError<T>(operation = 'operation', result?: any) {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    return (error: any): Observable<any> => of(error.error as any);
  }
  async close() {
    const getPlatform = Capacitor.getPlatform();
    if (getPlatform !== 'web') {
      await StatusBar.setOverlaysWebView({ overlay: true});
    }
    this.modal.dismiss(null, 'cancel');
  }
}
