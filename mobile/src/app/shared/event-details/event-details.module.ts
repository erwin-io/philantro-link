import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDetailsComponent } from './event-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MapBoxModule } from '../map-box/map-box.module';
import { PageLoaderModule } from '../page-loader/page-loader.module';



@NgModule({
  declarations: [EventDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MapBoxModule,
    PageLoaderModule
  ],
  exports: [EventDetailsComponent]
})
export class EventDetailsModule { }
