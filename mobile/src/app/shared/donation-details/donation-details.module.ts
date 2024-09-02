import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationDetailsComponent } from './donation-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PageLoaderModule } from '../page-loader/page-loader.module';


@NgModule({
  declarations: [DonationDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PageLoaderModule
  ],
  exports: [DonationDetailsComponent]
})
export class DonationDetailsModule { }
