import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Events } from "./Events";
import { Users } from "./Users";

@Index("EventMessage_pkey", ["eventMessageId"], { unique: true })
@Entity("EventMessage", { schema: "dbo" })
export class EventMessage {
  @PrimaryGeneratedColumn({ type: "bigint", name: "EventMessageId" })
  eventMessageId: string;

  @Column("character varying", { name: "Message" })
  message: string;

  @Column("timestamp with time zone", {
    name: "DateTimeSent",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateTimeSent: Date;

  @Column("character varying", { name: "Status", default: () => "'SENT'" })
  status: string;

  @Column("timestamp with time zone", {
    name: "LastUpdated",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  lastUpdated: Date;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @ManyToOne(() => Events, (events) => events.eventMessages)
  @JoinColumn([{ name: "EventId", referencedColumnName: "eventId" }])
  event: Events;

  @ManyToOne(() => Users, (users) => users.eventMessages)
  @JoinColumn([{ name: "FromUserId", referencedColumnName: "userId" }])
  fromUser: Users;

  @ManyToOne(() => Users, (users) => users.eventMessages2)
  @JoinColumn([{ name: "ToUserId", referencedColumnName: "userId" }])
  toUser: Users;
}
