import { DefaultUserDto } from "./user-base.dto";
export declare class UpdateUserDto extends DefaultUserDto {
    accessCode: string;
}
export declare class UpdateUserProfileDto extends DefaultUserDto {
    userProfilePic: any;
}
export declare class UpdateClientUserProfileDto extends DefaultUserDto {
    userProfilePic: any;
    helpNotifPreferences: string[];
}
