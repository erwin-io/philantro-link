import { Component, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-type-picker',
  templateUrl: './event-type-picker.component.html',
  styleUrls: ['./event-type-picker.component.scss'],
  host: {
    class: "event-type-picker"
  }
})
export class EventTypePickerComponent  implements OnInit {
  modal: HTMLIonModalElement;
  eventType: "CHARITY" | "VOLUNTEER" | "DONATION" | "ASSISTANCE";
  onSelectedChanged = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {}

  onContinue() {
    this.modal.dismiss(this.eventType);
  }
}
