
import { Files } from "./files";
import { MapPoint } from "./map";

export class Users {
    userId: string;
    userCode: string;
    userName: string;
    name: string;
    email: string;
    accessGranted: boolean;
    active: boolean;
    userType: "ADMIN" | "CLIENT";
    userProfilePic: UserProfilePic;
    currentLocation: MapPoint;
    helpNotifPreferences: string[] = [];
  }

  export class UserProfilePic {
    userId: string;
    file: Files;
    user: Users;
  }
