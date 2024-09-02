import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LandingPagePageRoutingModule } from './landing-page-routing.module';

import { LandingPagePage } from './landing-page.page';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LandingPagePageRoutingModule,
    NgOtpInputModule
  ],
  declarations: [LandingPagePage, LoginComponent, RegisterComponent]
})
export class LandingPagePageModule {}
