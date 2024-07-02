import { DefaultEventDto } from "./events-base.dto";
export declare class CreateCharityVolunteerEventDto extends DefaultEventDto {
    eventType: "CHARITY" | "VOLUNTEER";
    dateTime: any;
    userCode: string;
}
export declare class CreateDonationEventDto extends DefaultEventDto {
    userCode: string;
    transferType: string;
    transferAccountNumber: string;
    transferAccountName: string;
    donationTargetAmount: string;
}
export declare class CreateAssistanceEventDto extends DefaultEventDto {
    userCode: string;
}
