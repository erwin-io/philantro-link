import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpSupportComponent } from './help-support.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [HelpSupportComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  exports: [HelpSupportComponent]
})
export class HelpSupportModule { }
