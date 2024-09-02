import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventThumbnailComponent } from './event-thumbnail.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PipeModule } from '../pipe/pipe.module';



@NgModule({
  declarations: [EventThumbnailComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule
  ],
  exports: [EventThumbnailComponent]
})
export class EventThumbnailModule { }
