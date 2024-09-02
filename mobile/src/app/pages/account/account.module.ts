import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';

import { AccountPage } from './account.page';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AccountPageRoutingModule,
    NgOtpInputModule
  ],
  declarations: [AccountPage, AccountSettingsComponent],
})
export class AccountPageModule {}
