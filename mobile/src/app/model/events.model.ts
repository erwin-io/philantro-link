import { Files } from "./files";
import { MapPoint } from "./map";
import { Users } from "./users";
import { UserConversation } from './user-conversation.model';


export class Events {
  eventId: string;
  eventCode: string;
  dateTime: string;
  eventType: "CHARITY" | "VOLUNTEER" | "DONATION" | "ASSISTANCE";
  eventName: string;
  eventDesc: string;
  eventLocName: string;
  eventLocMap?: MapPoint;
  eventAssistanceItems: any[];
  eventStatus: "PENDING" | "APPROVED" | "REJECTED" | "INPROGRESS" | "COMPLETED" | "CANCELLED";
  active: boolean;
  user: Users;
  thumbnailFile: Files;
  eventImages: EventImage[];
  responded: any;
  interested: any;
  isCurrentUserInterested: boolean;
  isCurrentUserResponded: boolean;
  transferType: string;
  transferAccountNumber: string;
  transferAccountName: string;
  donationTargetAmount = 0;
  raisedDonation: number = 0;
  visitorUnReadMessage: number = 0;
  ownerUnReadNotifications: number = 0;
  inProgress: boolean = false;
  dateTimeUpdate: Date;
  visitorUserConversation: UserConversation;
  ownerUnReadMessage: number = 0;
  ownerUnReadNotif: number = 0;
  visitorUserDonation: number = 0;
}

export class EventImage {
  eventId: string;
  fileId: string;
  active: boolean;
  event: Events;
  file: Files;
  user: Users;
}

export class EventMessage {
  eventMessageId?: string;
  message: string;
  dateTimeSent?: Date;
  status?: string;
  lastUpdated?: Date;
  active?: boolean;
  event?: Events;
  fromUser?: Users;
  toUser?: Users;
}
