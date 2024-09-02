import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventNotificationsComponent } from './event-notifications.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MapBoxModule } from '../map-box/map-box.module';



@NgModule({
  declarations: [EventNotificationsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MapBoxModule
  ],
  exports: [EventNotificationsComponent]
})
export class EventNotificationsModule { }
