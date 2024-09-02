/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { Events } from 'src/app/model/events.model';

@Component({
  selector: 'horizontal-cards',
  templateUrl: './horizontal-cards.component.html',
  styleUrls: ['./horizontal-cards.component.scss'],
  host: {
    class: "horizontal-cards-wrapper"
  }
})
export class HorizontalCardsComponent  implements OnInit {
  @Input() event: Events;eventAssistanceItems
  @Input() showAssistanceItems: boolean = false;
  @Input() isLoading: boolean = false;
  constructor() { }

  ngOnInit() {}

}
