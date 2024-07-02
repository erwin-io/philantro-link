import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EventImage } from "./EventImage";
import { EventMessage } from "./EventMessage";
import { Events } from "./Events";
import { Interested } from "./Interested";
import { Notifications } from "./Notifications";
import { Responded } from "./Responded";
import { SupportTicket } from "./SupportTicket";
import { SupportTicketMessage } from "./SupportTicketMessage";
import { Transactions } from "./Transactions";
import { UserOneSignalSubscription } from "./UserOneSignalSubscription";
import { UserProfilePic } from "./UserProfilePic";
import { Access } from "./Access";

@Index("u_username", ["active", "userName", "userType"], { unique: true })
@Index("pk_users_1557580587", ["userId"], { unique: true })
@Entity("Users", { schema: "dbo" })
export class Users {
  @PrimaryGeneratedColumn({ type: "bigint", name: "UserId" })
  userId: string;

  @Column("character varying", { name: "UserName" })
  userName: string;

  @Column("character varying", { name: "Password" })
  password: string;

  @Column("boolean", { name: "AccessGranted" })
  accessGranted: boolean;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @Column("character varying", { name: "UserCode", nullable: true })
  userCode: string | null;

  @Column("character varying", { name: "UserType" })
  userType: string;

  @Column("character varying", { name: "Name", default: () => "''" })
  name: string;

  @Column("character varying", { name: "MobileNumber" })
  mobileNumber: string;

  @Column("json", { name: "CurrentLocation", nullable: true })
  currentLocation: object | null;

  @Column("varchar", { name: "AssistanceType", nullable: true, array: true })
  assistanceType: string[] | null;

  @OneToMany(() => EventImage, (eventImage) => eventImage.user)
  eventImages: EventImage[];

  @OneToMany(() => EventMessage, (eventMessage) => eventMessage.fromUser)
  eventMessages: EventMessage[];

  @OneToMany(() => EventMessage, (eventMessage) => eventMessage.toUser)
  eventMessages2: EventMessage[];

  @OneToMany(() => Events, (events) => events.user)
  events: Events[];

  @OneToOne(() => Interested, (interested) => interested.user)
  interested: Interested;

  @OneToMany(() => Notifications, (notifications) => notifications.user)
  notifications: Notifications[];

  @OneToOne(() => Responded, (responded) => responded.user)
  responded: Responded;

  @OneToMany(
    () => SupportTicket,
    (supportTicket) => supportTicket.assignedAdminUser
  )
  supportTickets: SupportTicket[];

  @OneToMany(() => SupportTicket, (supportTicket) => supportTicket.user)
  supportTickets2: SupportTicket[];

  @OneToMany(
    () => SupportTicketMessage,
    (supportTicketMessage) => supportTicketMessage.fromUser
  )
  supportTicketMessages: SupportTicketMessage[];

  @OneToMany(() => Transactions, (transactions) => transactions.user)
  transactions: Transactions[];

  @OneToMany(
    () => UserOneSignalSubscription,
    (userOneSignalSubscription) => userOneSignalSubscription.user
  )
  userOneSignalSubscriptions: UserOneSignalSubscription[];

  @OneToOne(() => UserProfilePic, (userProfilePic) => userProfilePic.user)
  userProfilePic: UserProfilePic;

  @ManyToOne(() => Access, (access) => access.users)
  @JoinColumn([{ name: "AccessId", referencedColumnName: "accessId" }])
  access: Access;
}
