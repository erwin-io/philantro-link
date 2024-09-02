import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PipeModule } from '../pipe/pipe.module';



@NgModule({
  declarations: [DatePickerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipeModule
  ],
  exports: [DatePickerComponent]
})
export class DatePickerModule { }
