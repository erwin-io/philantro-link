import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  modal: HTMLIonModalElement;
  datePreferedStart = new Date().toISOString();
  constructor() { }

  ngOnInit() {}

}
