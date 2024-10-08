import { DefaultEventDto } from "./events-base.dto";
export declare class UpdateCharityVolunteerEventDto extends DefaultEventDto {
    dateTime: any;
}
export declare class UpdateDonationEventDto extends DefaultEventDto {
    transferType: string;
    transferAccountNumber: string;
    transferAccountName: string;
    donationTargetAmount: string;
}
export declare class UpdateAssistanceEventDto extends DefaultEventDto {
    eventAssistanceItems: string[];
}
export declare class UpdateEventInterestedDto {
    userCode: string;
}
export declare class UpdateEventRespondedDto {
    userCode: string;
}
export declare class UpdateEventStatusDto {
    status: "APPROVED" | "REJECTED" | "COMPLETED" | "INPROGRESS" | "CANCELLED";
}
