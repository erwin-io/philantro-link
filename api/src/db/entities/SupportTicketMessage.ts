import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { SupportTicket } from "./SupportTicket";

@Index("SupportTicketMessage_pkey", ["supportTicketMessageId"], {
  unique: true,
})
@Entity("SupportTicketMessage", { schema: "dbo" })
export class SupportTicketMessage {
  @PrimaryGeneratedColumn({ type: "bigint", name: "SupportTicketMessageId" })
  supportTicketMessageId: string;

  @Column("character varying", { name: "Message" })
  message: string;

  @Column("timestamp with time zone", {
    name: "DateTimeSent",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateTimeSent: Date;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @Column("character varying", { name: "Status", default: () => "'SENT'" })
  status: string;

  @ManyToOne(() => Users, (users) => users.supportTicketMessages)
  @JoinColumn([{ name: "FromUserId", referencedColumnName: "userId" }])
  fromUser: Users;

  @ManyToOne(
    () => SupportTicket,
    (supportTicket) => supportTicket.supportTicketMessages
  )
  @JoinColumn([
    { name: "SupportTicketId", referencedColumnName: "supportTicketId" },
  ])
  supportTicket: SupportTicket;
}
