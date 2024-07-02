import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Events } from "./Events";
import { Files } from "./Files";
import { Users } from "./Users";

@Index("EventImage_pkey", ["eventId", "fileId"], { unique: true })
@Entity("EventImage", { schema: "dbo" })
export class EventImage {
  @Column("bigint", { primary: true, name: "EventId" })
  eventId: string;

  @Column("bigint", { primary: true, name: "FileId" })
  fileId: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @ManyToOne(() => Events, (events) => events.eventImages)
  @JoinColumn([{ name: "EventId", referencedColumnName: "eventId" }])
  event: Events;

  @ManyToOne(() => Files, (files) => files.eventImages)
  @JoinColumn([{ name: "FileId", referencedColumnName: "fileId" }])
  file: Files;

  @ManyToOne(() => Users, (users) => users.eventImages)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;
}
