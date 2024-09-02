import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonateFormComponent } from './donate-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [DonateFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  exports: [
    DonateFormComponent
  ]
})
export class DonateFormModule { }
