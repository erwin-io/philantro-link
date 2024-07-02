import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapBoxComponent } from './map-box.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from '../material/material.module';
import { GoogleMapsModule } from '@angular/google-maps';



@NgModule({
  declarations: [MapBoxComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
  ],
  exports: [MapBoxComponent]
})
export class MapBoxModule { }
