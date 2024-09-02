import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventTypePickerComponent } from './event-type-picker.component';
import { IonicModule } from '@ionic/angular';
import { PipeModule } from '../pipe/pipe.module';



@NgModule({
  declarations: [EventTypePickerComponent],
  imports: [
    CommonModule,
    IonicModule,
    PipeModule
  ],
  exports: [EventTypePickerComponent],
})
export class EventTypePickerModule { }
