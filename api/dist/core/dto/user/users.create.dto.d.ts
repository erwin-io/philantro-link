import { DefaultUserDto } from "./user-base.dto";
export declare class CreateClientUserDto extends DefaultUserDto {
    password: string;
}
export declare class CreateAdminUserDto extends DefaultUserDto {
    password: string;
    accessCode: string;
}
