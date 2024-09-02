import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalCardsComponent } from './horizontal-cards.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [HorizontalCardsComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [
    HorizontalCardsComponent
  ]
})
export class HorizontalCardsModule { }
