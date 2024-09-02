import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapBoxComponent } from './map-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [MapBoxComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    IonicModule
  ],
  exports: [MapBoxComponent]
})
export class MapBoxModule { }
