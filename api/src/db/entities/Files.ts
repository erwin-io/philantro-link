import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EventImage } from "./EventImage";
import { Events } from "./Events";
import { UserProfilePic } from "./UserProfilePic";

@Index("pk_files_901578250", ["fileId"], { unique: true })
@Entity("Files", { schema: "dbo" })
export class Files {
  @PrimaryGeneratedColumn({ type: "bigint", name: "FileId" })
  fileId: string;

  @Column("text", { name: "FileName" })
  fileName: string;

  @Column("text", { name: "Url", nullable: true })
  url: string | null;

  @Column("text", { name: "GUID" })
  guid: string;

  @OneToMany(() => EventImage, (eventImage) => eventImage.file)
  eventImages: EventImage[];

  @OneToMany(() => Events, (events) => events.thumbnailFile)
  events: Events[];

  @OneToMany(() => UserProfilePic, (userProfilePic) => userProfilePic.file)
  userProfilePics: UserProfilePic[];
}
