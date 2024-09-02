import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateEventFormComponent } from './create-event-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MapBoxModule } from '../map-box/map-box.module';
import { PipeModule } from '../pipe/pipe.module';
import { DatePickerModule } from '../date-picker/date-picker.module';
import { EventThumbnailModule } from '../event-thumbnail/event-thumbnail.module';



@NgModule({
  declarations: [CreateEventFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MapBoxModule,
    PipeModule,
    EventThumbnailModule
  ],
  exports: [CreateEventFormComponent]
})
export class CreateEventFormModule { }
