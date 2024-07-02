import { HttpClient } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/compiler';
import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { OneSignal } from 'onesignal-ngx';
import { Users } from 'src/app/model/users';
import { AuthService } from 'src/app/services/auth.service';
import { OneSignalService } from 'src/app/services/one-signal.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: {
    class: "page-component"
  }
})
export class LoginComponent {
  logInForm = this.formBuilder.group({
    userName: ['', Validators.required],
    password: ['', Validators.required]
});
  loading = false;
  submitted = false;
  error: string;
  isProcessing = false;

  constructor(
    private oneSignal: OneSignal,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private storageService: StorageService,
    private oneSignalService: OneSignalService,
    private snackBar: MatSnackBar,
    private router: Router) {
      // redirect to home if already logged in

      const user = this.storageService.getLoginProfile();
      if(user) {
        this.authService.redirectToPage(false);
      }
    }

  ngOnInit() {
  }

  onSubmit() {
    if (this.logInForm.invalid) {
        return;
    }
    try{
      const params = this.logInForm.value;
      this.authService.login(params)
        .subscribe(async res => {
          if (res.success) {
            this.oneSignalService.init(res.data);
            this.storageService.saveLoginProfile(res.data);
            this.authService.redirectToPage(false);
          } else {
            this.error = Array.isArray(res.message) ? res.message[0] : res.message;
            this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          }
        }, async (res) => {
          this.error = res.error.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        });
    } catch (e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
    }
  }
}
