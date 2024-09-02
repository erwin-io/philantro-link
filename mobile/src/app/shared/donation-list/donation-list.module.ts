import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DonationListComponent } from './donation-list.component';
import { PageLoaderModule } from '../page-loader/page-loader.module';

@NgModule({
  declarations: [DonationListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PageLoaderModule
  ],
  exports: [DonationListComponent]
})
export class DonationListModule { }
