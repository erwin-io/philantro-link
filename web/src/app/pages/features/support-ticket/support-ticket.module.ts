import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { SupportTicketComponent } from './support-ticket.component';
import { SupportTicketDetailsComponent } from './support-ticket-details/support-ticket-details.component';
import { MapBoxModule } from 'src/app/shared/map-box/map-box.module';


export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/support-ticket/open'
  },
  {
    path: 'open',
    pathMatch: 'full',
    component: SupportTicketComponent,
    data: { title: "Support Ticket", tab: 0 }
  },
  {
    path: 'active',
    pathMatch: 'full',
    component: SupportTicketComponent,
    data: { title: "Support Ticket", tab: 1 }
  },
  {
    path: 'completed',
    pathMatch: 'full',
    component: SupportTicketComponent,
    data: { title: "Support Ticket", tab: 2 }
  },
  {
    path: 'closed',
    pathMatch: 'full',
    component: SupportTicketComponent,
    data: { title: "Support Ticket", tab: 3 }
  },
  {
    path: ':supportTicketCode/details',
    component: SupportTicketDetailsComponent,
    data: { title: "Support Ticket", details: true }
  },
]

@NgModule({
  declarations: [
    SupportTicketComponent,
    SupportTicketDetailsComponent
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
export class SupportTicketModule { }
