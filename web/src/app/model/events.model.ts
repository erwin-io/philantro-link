import { EventLocMap } from "./map.model";
import { Users } from "./users";


export class Events {
  eventId: string;
  eventCode: string;
  dateTime: string;
  eventType: "CHARITY" | "VOLUNTEER" | "DONATION" | "ASSISTANCE";
  eventName: string;
  eventDesc: string;
  eventLocName: string;
  eventLocMap?: EventLocMap;
  eventAssistanceItems: any[];
  eventStatus: string;
  active: boolean;
  user: Users;
  eventImages: any[];
  responded: any;
  interested: any;
  isCurrentUserInterested: boolean;
  isCurrentUserResponded: boolean;
  transferType: string;
  transferAccountNumber: string;
  transferAccountName: string;
  donationTargetAmount = 0;
  raisedDonation: number = 0;
  inProgress: boolean = false;
}
