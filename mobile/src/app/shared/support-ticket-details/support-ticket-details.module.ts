import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportTicketDetailsComponent } from './support-ticket-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [SupportTicketDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  exports: [SupportTicketDetailsComponent]
})
export class SupportTicketDetailsModule { }
