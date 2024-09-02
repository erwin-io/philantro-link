/* eslint-disable max-len */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { IonModal, ModalController } from '@ionic/angular';
import { Observable, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { AnimationService } from 'src/app/services/animation.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { PageLoaderService } from 'src/app/services/page-loader.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  modal;
  isSubmitting = false;
  error;

  orientation: "PORTRAIT" | "LANDSCAPE" = "PORTRAIT";
  mode: 'SUBMIT' | 'VERIFY' = 'SUBMIT';
  otp = "";
  isOpenResultModal = false;
  resultModal: {
    type: 'success' | 'failed' | 'warning';
    title: string;
    desc: string;
    done?;
    retry?;
  };

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    if(pass === confirmPass) {
      return null;
    } else {
      group.get('confirmPassword')?.setErrors({ notSame: true });
      return { notSame: true };
    }
  };

  signUpForm = new FormGroup({
    name : new FormControl("Erwin", [Validators.required, Validators.minLength(2)]),
    email: new FormControl("erwinramirez220@gmail.com", [Validators.required,Validators.email]),
    helpNotifPreferences: new FormControl([]),
    password: new FormControl("123456", [Validators.required,Validators.minLength(6),Validators.maxLength(16)]),
    confirmPassword : new FormControl("123456", [Validators.required]),
  },
  { validators: this.checkPasswords });
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private modalCtrl: ModalController,
    private appconfig: AppConfigService,
    private pageLoaderService: PageLoaderService,
    private authService: AuthService,
    private animationService: AnimationService,
    private formBuilder: FormBuilder) { 
      window.addEventListener('orientationchange', ()=> {
        setTimeout(()=> {
          
          if (window.innerHeight > window.innerWidth) {
            this.orientation = "PORTRAIT";
          } else {
            this.orientation = "LANDSCAPE";
          }
        }, 500)
      });
    }

  async ngOnInit() {
    const getPlatform = Capacitor.getPlatform();
    if (getPlatform !== 'web') {
      await StatusBar.setStyle({style: Style.Light});
      await StatusBar.setBackgroundColor({color:"#ffffff"});
    }
  }

  onOtpChange(otp) {
    this.otp = otp;
  }

  getError(key): ValidationErrors {
    if(this.signUpForm.controls[key]?.touched && ( this.signUpForm.controls[key]?.dirty || this.signUpForm.controls[key]?.invalid || !this.signUpForm.controls[key]?.valid)) {
      return this.signUpForm.controls[key]?.errors;
    }
    else {
      return null;
    }
  }

  async onSignUp() {
    try {
      this.signUpForm.markAllAsTouched();
      if(this.signUpForm.valid && !this.signUpForm.invalid ) {
        const formData = this.signUpForm.value;
        this.isSubmitting = true;
        await this.pageLoaderService.open('Please wait...');
        this.authService.registerClient(formData).pipe(
          takeUntil(this.ngUnsubscribe),
        ).subscribe(async res=> {
          await this.pageLoaderService.close();
          if(res.success) {
            // this.modal.dismiss(res.data, 'confirm');
            
            // this.registerComplete.present();
            this.isSubmitting = false;
            this.mode = "VERIFY";
            this.error = null;
          } else {
            this.error = res.message.toString();
            this.isOpenResultModal = true;
            this.resultModal = {
              title: 'Error!',
              desc: 'Oops, ' + this.error,
              type: 'failed',
              retry: ()=> {
                this.isOpenResultModal = false;
              },
            };
            this.isSubmitting = false;
          }

          this.ngUnsubscribe.next();
          this.ngUnsubscribe.complete();
        }, async (err)=> {

          await this.pageLoaderService.close();
          this.ngUnsubscribe.next();
          this.ngUnsubscribe.complete();
          this.isSubmitting = false;
          this.error = err.message.toString();
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
      await this.pageLoaderService.close();
      this.error = ex.message.toString();
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
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }
  }

  async onVerify() {
    this.error = null;
    try {
      if(this.otp && this.otp !=="") {
        this.isSubmitting = true;
        await this.pageLoaderService.open('Please wait...');
        this.authService.registerVerify({
          otp: this.otp,
          email: this.signUpForm.value.email,
        }).pipe(
          takeUntil(this.ngUnsubscribe),
          catchError(this.handleError('login', []))
        ).subscribe(async res=> {
          if(res.success && res.data) {
            this.mode = "SUBMIT";
            await this.pageLoaderService.close();
            this.signUpForm.reset();
            this.signUpForm.markAsPristine();
            this.signUpForm.markAsUntouched();
            this.isSubmitting = false;
            this.isOpenResultModal = true;
            this.resultModal = {
              title: 'Your email has been successfully verified!',
              desc: 'Welcome to Philantrolink! Start exploring, connecting, and sharing with others now.',
              type: 'success',
              done: async ()=> {
                const getPlatform = Capacitor.getPlatform();
                if (getPlatform !== 'web') {
                  await StatusBar.setOverlaysWebView({ overlay: false});
                  await StatusBar.setStyle({style: Style.Light});
                  await StatusBar.setBackgroundColor({color:"#ffffff"});
                }
                this.isOpenResultModal = false;
                this.close();
              },
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

  isAssistanceItemSelected(helpType) {
    const items: string[] = this.signUpForm.value.helpNotifPreferences;
    return items.some(x=> x.toString().toLowerCase() === helpType.toString().toLowerCase());
  }

  selectAssistanceItem(helpType) {
    let items: string[] = this.signUpForm.value.helpNotifPreferences
    if(!this.isAssistanceItemSelected(helpType)) {
      items.push(helpType);
    } else {
      items = items.filter(x=> x.toString().toLowerCase() !== helpType.toString().toLowerCase());
    }
    this.signUpForm.controls.helpNotifPreferences.setValue(items);
    this.signUpForm.controls.helpNotifPreferences.markAsDirty();
    this.signUpForm.controls.helpNotifPreferences.markAsTouched();
  }

  handleError<T>(operation = 'operation', result?: any) {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    return (error: any): Observable<any> => of(error.error as any);
  }
  
  close() {
    this.modal.dismiss(null, 'cancel');
  }

}
