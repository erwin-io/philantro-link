import { Access } from "./access.model";
import { Files } from "./files.model";

export class Users {
    userId: string;
    userCode: string;
    userName: string;
    name: string;
    mobileNumber: string;
    accessGranted: boolean;
    active: boolean;
    userType: "ADMIN" | "CLIENT";
    access: Access = {} as any;
    userProfilePic: UserProfilePic;
  }

  export class UserProfilePic {
    userId: string;
    file: Files;
    user: Users;
  }
