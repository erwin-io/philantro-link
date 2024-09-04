import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyDonationComponent } from './my-donation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PageLoaderModule } from '../page-loader/page-loader.module';



@NgModule({
  declarations: [MyDonationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PageLoaderModule
  ],
  exports: [MyDonationComponent]
})
export class MyDonationModule { }
