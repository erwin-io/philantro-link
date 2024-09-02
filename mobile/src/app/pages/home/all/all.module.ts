import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllPageRoutingModule } from './all-routing.module';

import { AllPage } from './all.page';
import { HorizontalCardsModule } from 'src/app/shared/horizontal-cards/horizontal-cards.module';
import { VerticalCardsModule } from 'src/app/shared/vertical-cards/vertical-cards.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllPageRoutingModule,
    HorizontalCardsModule,
    VerticalCardsModule
  ],
  declarations: [AllPage]
})
export class AllPageModule {}
