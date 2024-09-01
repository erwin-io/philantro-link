import { DefaultUserDto } from "../user/user-base.dto";
export declare class RegisterClientUserDto extends DefaultUserDto {
    password: string;
    helpNotifPreferences: string[];
}
