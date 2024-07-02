import { EventImage } from "./EventImage";
import { Events } from "./Events";
import { UserProfilePic } from "./UserProfilePic";
export declare class Files {
    fileId: string;
    fileName: string;
    url: string | null;
    guid: string;
    eventImages: EventImage[];
    events: Events[];
    userProfilePics: UserProfilePic[];
}
