import { Files } from "./files.model";
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
  eventStatus: "PENDING" | "APPROVED" | "REJECTED" | "INPROGRESS" | "COMPLETED" | "CANCELLED";
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
  thumbnailFile: Files;
  inProgress: boolean = false;
}
