import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EventImage } from "./EventImage";
import { EventMessage } from "./EventMessage";
import { Files } from "./Files";
import { Users } from "./Users";
import { Interested } from "./Interested";
import { Responded } from "./Responded";
import { Transactions } from "./Transactions";

@Index("Event_pkey", ["eventId"], { unique: true })
@Entity("Events", { schema: "dbo" })
export class Events {
  @PrimaryGeneratedColumn({ type: "bigint", name: "EventId" })
  eventId: string;

  @Column("character varying", { name: "EventCode", nullable: true })
  eventCode: string | null;

  @Column("timestamp with time zone", { name: "DateTime" })
  dateTime: Date;

  @Column("character varying", { name: "EventType" })
  eventType: string;

  @Column("character varying", { name: "EventName" })
  eventName: string;

  @Column("character varying", { name: "EventDesc", nullable: true })
  eventDesc: string | null;

  @Column("character varying", { name: "EventLocName" })
  eventLocName: string;

  @Column("json", { name: "EventLocMap", default: {} })
  eventLocMap: object;

  @Column("varchar", {
    name: "EventAssistanceItems",
    nullable: true,
    array: true,
    default: () => "'{}'[]",
  })
  eventAssistanceItems: string[] | null;

  @Column("character varying", {
    name: "EventStatus",
    nullable: true,
    default: () => "'PENDING'",
  })
  eventStatus: string | null;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @Column("character varying", { name: "TransferType", nullable: true })
  transferType: string | null;

  @Column("character varying", {
    name: "TransferAccountNumber",
    nullable: true,
  })
  transferAccountNumber: string | null;

  @Column("character varying", { name: "TransferAccountName", nullable: true })
  transferAccountName: string | null;

  @Column("numeric", {
    name: "DonationTargetAmount",
    nullable: true,
    default: () => "0",
  })
  donationTargetAmount: string | null;

  @Column("boolean", {
    name: "InProgress",
    nullable: true,
    default: () => "false",
  })
  inProgress: boolean | null;

  @OneToMany(() => EventImage, (eventImage) => eventImage.event)
  eventImages: EventImage[];

  @OneToMany(() => EventMessage, (eventMessage) => eventMessage.event)
  eventMessages: EventMessage[];

  @ManyToOne(() => Files, (files) => files.events)
  @JoinColumn([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }])
  thumbnailFile: Files;

  @ManyToOne(() => Users, (users) => users.events)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;

  @OneToMany(() => Interested, (interested) => interested.event)
  interesteds: Interested[];

  @OneToMany(() => Responded, (responded) => responded.event)
  respondeds: Responded[];

  @OneToMany(() => Transactions, (transactions) => transactions.event)
  transactions: Transactions[];
}
