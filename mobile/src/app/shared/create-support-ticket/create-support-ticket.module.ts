import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateSupportTicketComponent } from './create-support-ticket.component';



@NgModule({
  declarations: [CreateSupportTicketComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  exports: [CreateSupportTicketComponent]
})
export class CreateSupportTicketModule { }
