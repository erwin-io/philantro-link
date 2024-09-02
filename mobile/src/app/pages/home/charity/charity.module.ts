import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CharityPageRoutingModule } from './charity-routing.module';

import { CharityPage } from './charity.page';
import { VerticalCardsModule } from 'src/app/shared/vertical-cards/vertical-cards.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CharityPageRoutingModule,
    VerticalCardsModule
  ],
  declarations: [CharityPage]
})
export class CharityPageModule {}
