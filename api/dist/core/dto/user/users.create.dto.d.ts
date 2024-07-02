import { DefaultUserDto } from "./user-base.dto";
export declare class CreateUserDto extends DefaultUserDto {
    password: string;
    accessCode: string;
    userType: "ADMIN";
}
