import { Component, Input, OnInit } from '@angular/core';
import { Events } from 'src/app/model/events.model';
import { getEventCardDefaultImage } from '../utility/utility';
import { StorageService } from 'src/app/services/storage.service';
import { Users } from 'src/app/model/users';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'vertical-cards',
  templateUrl: './vertical-cards.component.html',
  styleUrls: ['./vertical-cards.component.scss'],
  host: {
    class: "vertical-cards-wrapper"
  }
})
export class VerticalCardsComponent implements OnInit {
  @Input() event: Events;
  @Input() showEventType: boolean = true;
  @Input() showInterest: boolean = false;
  @Input() isLoading: boolean = false;
  currentUser: Users;
  constructor(
    private storageService: StorageService,) { 
      this.currentUser = this.storageService.getLoginProfile();
    }

  ngOnInit() {}

  getDonationPercentage(event: Events) {
    if(event && !isNaN(Number(event?.raisedDonation)) && !isNaN(Number(event?.donationTargetAmount))) {
      // return (100 * Number(event?.raisedDonation)) / Number(event?.donationTargetAmount);
      const percent = ((Number(event?.raisedDonation) / Number(event?.donationTargetAmount)) * 100);
      return percent > 0.5 ? percent / 100 : percent;
    } else {
      return 0;
    }
  }

  eventImage(){
    return this.event?.thumbnailFile && this.event?.thumbnailFile?.url;
  }

  imageErrorHandler(event, type) {
    event.target.src = getEventCardDefaultImage(type);
  }

}
