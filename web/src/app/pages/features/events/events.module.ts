import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { EventsComponent } from './events.component';
import { EventsDetailsComponent } from './events-details/events-details.component';
import { MapBoxModule } from 'src/app/shared/map-box/map-box.module';


export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/events/pending'
  },
  {
    path: 'pending',
    pathMatch: 'full',
    component: EventsComponent,
    data: { title: "Events Manager", tab: 0 }
  },
  {
    path: 'approved',
    pathMatch: 'full',
    component: EventsComponent,
    data: { title: "Events Manager", tab: 1 }
  },
  {
    path: 'completed',
    pathMatch: 'full',
    component: EventsComponent,
    data: { title: "Events Manager", tab: 2 }
  },
  {
    path: 'rejected',
    pathMatch: 'full',
    component: EventsComponent,
    data: { title: "Events Manager", tab: 3 }
  },
  {
    path: 'cancelled',
    pathMatch: 'full',
    component: EventsComponent,
    data: { title: "Events Manager", tab: 4 }
  },
  {
    path: ':eventCode/details',
    component: EventsDetailsComponent,
    data: { title: "Events Manager", details: true }
  },
]

@NgModule({
  declarations: [
    EventsComponent,
    EventsDetailsComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    MapBoxModule
  ]
})
export class EventsModule { }
