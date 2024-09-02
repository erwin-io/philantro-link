import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelpPageRoutingModule } from './help-routing.module';

import { HelpPage } from './help.page';
import { VerticalCardsModule } from 'src/app/shared/vertical-cards/vertical-cards.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpPageRoutingModule,
    VerticalCardsModule
  ],
  declarations: [HelpPage]
})
export class HelpPageModule {}
