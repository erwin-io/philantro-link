import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditEventFormComponent } from './edit-event-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MapBoxModule } from '../map-box/map-box.module';
import { EventThumbnailModule } from '../event-thumbnail/event-thumbnail.module';



@NgModule({
  declarations: [EditEventFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({
      callSetDisabledState: 'whenDisabledForLegacyCode'
    }),
    IonicModule,
    MapBoxModule,
    EventThumbnailModule
  ],
  exports: [EditEventFormComponent]
})
export class EditEventFormModule { }
