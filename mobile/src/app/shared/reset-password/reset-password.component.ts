import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { catchError, Observable, of, Subject, takeUntil } from 'rxjs';
import { Users } from 'src/app/model/users';
import { AnimationService } from 'src/app/services/animation.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { PageLoaderService } from 'src/app/services/page-loader.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserOneSignalSubscriptionService } from 'src/app/services/user-one-signal-subscription.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  headerColor: any | "primary" = "";
  title = "Forgot Password";
  modal;
  isFromLandingPage = false;
  isSubmitting = false;
  submitForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });
  
  otp = "";
  resetForm = new FormGroup({
    password: new FormControl(null, [Validators.required,Validators.minLength(6),Validators.maxLength(16)]),
    confirmPassword : new FormControl(null, [Validators.required]),
  });
  error;
  mode: 'SUBMIT' | 'VERIFY' | 'RESET' = 'SUBMIT';
  isOpenResultModal = false;
  resultModal: {
    type: 'success' | 'failed' | 'warning';
    title: string;
    desc: string;
    done?;
    retry?;
  };
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private modalCtrl: ModalController,
    private appconfig: AppConfigService,
    private pageLoaderService: PageLoaderService,
    private storageService: StorageService,
    private userOneSignalSubscriptionService: UserOneSignalSubscriptionService,
    private authService: AuthService,
    private animationService: AnimationService,
    private formBuilder: FormBuilder) {
      window.addEventListener("deviceorientation", (e)=> {
      }, true);
    }

  async ngOnInit() {


    this.ngUnsubscribe.next();
    // This completes the subject properlly.
    this.ngUnsubscribe.complete();

  }

  public ngOnDestroy(): void {
      // This aborts all HTTP requests.
      this.ngUnsubscribe.next();
      // This completes the subject properlly.
      this.ngUnsubscribe.complete();
  }
  onOtpChange(otp) {
    this.otp = otp;
  }

  async onSubmit() {
    this.error = null;
    try {
      this.submitForm.markAllAsTouched();
      if(this.submitForm.valid && !this.submitForm.invalid ) {
        this.isSubmitting = true;
        await this.pageLoaderService.open('Please wait...');
        this.authService.resetSubmit({
          email: this.submitForm.value.email,
        }).pipe(
          takeUntil(this.ngUnsubscribe),
          catchError(this.handleError('login', []))
        ).subscribe(async res=> {
          if(res.success && res.data) {
            this.mode = "VERIFY";
            await this.pageLoaderService.close();
            this.isSubmitting = false;
          } else {
            this.error = res.message.toString();
            await this.pageLoaderService.close();
            this.isSubmitting = false;
            this.isOpenResultModal = true;
            this.resultModal = {
              title: 'Error!',
              desc: 'Oops, ' + this.error,
              type: 'failed',
              retry: ()=> {
                this.isOpenResultModal = false;
              },
            };
          }

          this.ngUnsubscribe.next();
          this.ngUnsubscribe.complete();
        }, async (err)=> {

          this.error = err?.message ? err?.message.toString() : err?.toString();
          await this.pageLoaderService.close();
          this.isSubmitting = false;
          this.ngUnsubscribe.next();
          this.ngUnsubscribe.complete();
          this.isOpenResultModal = true;
          this.resultModal = {
            title: 'Error!',
            desc: 'Oops, ' + this.error,
            type: 'failed',
            retry: ()=> {
              this.isOpenResultModal = false;
            },
          };
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
      this.isOpenResultModal = true;
      this.resultModal = {
        title: 'Error!',
        desc: 'Oops, ' + this.error,
        type: 'failed',
        retry: ()=> {
          this.isOpenResultModal = false;
        },
      };
    }
  }

  async onVerify() {
    this.error = null;
    try {
      if(this.otp && this.otp !=="") {
        this.isSubmitting = true;
        await this.pageLoaderService.open('Please wait...');
        this.authService.resetVerify({
          otp: this.otp,
          email: this.submitForm.value.email,
        }).pipe(
          takeUntil(this.ngUnsubscribe),
          catchError(this.handleError('login', []))
        ).subscribe(async res=> {
          if(res.success && res.data) {
            this.mode = "RESET";
            await this.pageLoaderService.close();
            this.isSubmitting = false;
          } else {
            this.error = res.message.toString();
            await this.pageLoaderService.close();
            this.isSubmitting = false;
            this.isOpenResultModal = true;
            this.resultModal = {
              title: 'Error!',
              desc: 'Oops, ' + this.error,
              type: 'failed',
              retry: ()=> {
                this.isOpenResultModal = false;
              },
            };
          }

          this.ngUnsubscribe.next();
          this.ngUnsubscribe.complete();
        }, async (err)=> {

          this.error = err?.message ? err?.message.toString() : err?.toString();
          await this.pageLoaderService.close();
          this.isSubmitting = false;
          this.ngUnsubscribe.next();
          this.ngUnsubscribe.complete();
          this.isOpenResultModal = true;
          this.resultModal = {
            title: 'Error!',
            desc: 'Oops, ' + this.error,
            type: 'failed',
            retry: ()=> {
              this.isOpenResultModal = false;
            },
          };
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
      this.isOpenResultModal = true;
      this.resultModal = {
        title: 'Error!',
        desc: 'Oops, ' + this.error,
        type: 'failed',
        retry: ()=> {
          this.isOpenResultModal = false;
        },
      };
    }
  }

  async onReset() {
    this.error = null;
    try {
      this.resetForm.markAllAsTouched();
      if(this.resetForm.valid && !this.resetForm.invalid ) {
        this.isSubmitting = true;
        await this.pageLoaderService.open('Please wait...');
        this.authService.resetPassword({
          email: this.submitForm.value.email,
          otp: this.otp,
          password: this.resetForm.value.password,
          confirmPassword: this.resetForm.value.confirmPassword,
        }).pipe(
          takeUntil(this.ngUnsubscribe),
          catchError(this.handleError('login', []))
        ).subscribe(async res=> {
          if(res.success) {
            this.mode = "SUBMIT";
            await this.pageLoaderService.close();
            this.isSubmitting = false;
            this.submitForm.reset();
            this.otp = "";
            this.resetForm.reset();
            this.isOpenResultModal = true;
            this.resultModal = {
              title: 'Password Changed!',
              desc: 'Your password has been change successfully!',
              type: 'success',
              done: ()=> {
                this.isOpenResultModal = false;
                this.close();
              }
            };
          } else {
            this.error = res.message.toString();
            await this.pageLoaderService.close();
            this.isSubmitting = false;
            this.isOpenResultModal = true;
            this.resultModal = {
              title: 'Error!',
              desc: 'Oops, ' + this.error,
              type: 'failed',
              retry: ()=> {
                this.isOpenResultModal = false;
              },
            };
          }

          this.ngUnsubscribe.next();
          this.ngUnsubscribe.complete();
        }, async (err)=> {

          this.error = err?.message ? err?.message.toString() : err?.toString();
          await this.pageLoaderService.close();
          this.isSubmitting = false;
          this.ngUnsubscribe.next();
          this.ngUnsubscribe.complete();
          this.isOpenResultModal = true;
          this.resultModal = {
            title: 'Error!',
            desc: 'Oops, ' + err.message,
            type: 'failed',
            retry: ()=> {
              this.isOpenResultModal = false;
            },
          };
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
      this.isOpenResultModal = true;
      this.resultModal = {
        title: 'Error!',
        desc: 'Oops, ' + this.error,
        type: 'failed',
        retry: ()=> {
          this.isOpenResultModal = false;
        },
      };
    }
  }

  getError(key): ValidationErrors {
    if(this.submitForm?.controls[key]?.touched && ( this.submitForm.controls[key]?.dirty || this.submitForm.controls[key]?.invalid || !this.submitForm.controls[key]?.valid)) {
      return this.submitForm?.controls[key]?.errors;
    }
    else if(key === "otp" && this.otp === "") {
      return { required: true };
    }
    else if(this.resetForm?.controls[key]?.touched && ( this.resetForm.controls[key]?.dirty || this.resetForm.controls[key]?.invalid || !this.resetForm.controls[key]?.valid)) {
      return this.resetForm?.controls[key]?.errors;
    }
    else {
      return null;
    }
  }

  focusOTPInput(event, nextElementId: number) {
    if(!isNaN(Number(event.key))) {
      const nextInput = document.getElementById(`otp${nextElementId}`) as HTMLIonInputElement;
      if (nextInput) {
        setTimeout(()=> {
          nextInput.setFocus();
        },200)
      }
    }
    else if(event.key === "Backspace") {
      nextElementId = nextElementId - 2;
      const nextInput = document.getElementById(`otp${nextElementId}`) as HTMLIonInputElement;
      if (nextInput) {
        nextInput.setFocus();
      }
    }
  }

  handleError<T>(operation = 'operation', result?: any) {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    return (error: any): Observable<any> => of(error.error as any);
  }
  async close() {
    this.modal.dismiss(null, 'cancel');
  }
}
