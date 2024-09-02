import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalCardsComponent } from './vertical-cards.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [VerticalCardsComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [
    VerticalCardsComponent
  ]
})
export class VerticalCardsModule { }
