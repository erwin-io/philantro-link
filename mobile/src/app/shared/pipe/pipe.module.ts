import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from './time-ago.pipe';
import { NumberLeadZeroPipe } from './number-lead-zero.pipe';
import { CensoredStringPipe } from './censored-string.pipe';
import { DateLocalPipe } from './date-local.pipe';



@NgModule({
  declarations: [
    TimeAgoPipe,
    NumberLeadZeroPipe,
    CensoredStringPipe,
    DateLocalPipe,
  ],
  exports: [
    TimeAgoPipe,
    NumberLeadZeroPipe,
    CensoredStringPipe,
    DateLocalPipe
  ],
})
export class PipeModule { }
