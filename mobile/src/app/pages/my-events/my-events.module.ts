import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyEventsPageRoutingModule } from './my-events-routing.module';

import { MyEventsPage } from './my-events.page';
import { VerticalCardsModule } from 'src/app/shared/vertical-cards/vertical-cards.module';
import { InterestedEventsComponent } from './interested-events/interested-events.component';
import { JoinedEventsComponent } from './joined-events/joined-events.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyEventsPageRoutingModule,
    VerticalCardsModule
  ],
  declarations: [MyEventsPage, JoinedEventsComponent, InterestedEventsComponent],
})
export class MyEventsPageModule {}
