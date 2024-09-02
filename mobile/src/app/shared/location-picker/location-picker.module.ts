import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationPickerComponent } from './location-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MapBoxModule } from '../map-box/map-box.module';



@NgModule({
  declarations: [LocationPickerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MapBoxModule,
  ],
  exports: [LocationPickerComponent]
})
export class LocationPickerModule { }
