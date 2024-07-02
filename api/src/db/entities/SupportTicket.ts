import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { SupportTicketMessage } from "./SupportTicketMessage";

@Index("SupportTicket_pkey", ["supportTicketId"], { unique: true })
@Entity("SupportTicket", { schema: "dbo" })
export class SupportTicket {
  @PrimaryGeneratedColumn({ type: "bigint", name: "SupportTicketId" })
  supportTicketId: string;

  @Column("character varying", { name: "SupportTicketCode", nullable: true })
  supportTicketCode: string | null;

  @Column("character varying", { name: "Title" })
  title: string;

  @Column("character varying", { name: "Description" })
  description: string;

  @Column("timestamp with time zone", { name: "DateTimeSent", nullable: true })
  dateTimeSent: Date | null;

  @Column("character varying", { name: "Status", default: () => "'PENDING'" })
  status: string;

  @Column("timestamp with time zone", { name: "LastUpdated", nullable: true })
  lastUpdated: Date | null;

  @Column("character varying", { name: "Type" })
  type: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @ManyToOne(() => Users, (users) => users.supportTickets)
  @JoinColumn([{ name: "AssignedAdminUserId", referencedColumnName: "userId" }])
  assignedAdminUser: Users;

  @ManyToOne(() => Users, (users) => users.supportTickets2)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;

  @OneToMany(
    () => SupportTicketMessage,
    (supportTicketMessage) => supportTicketMessage.supportTicket
  )
  supportTicketMessages: SupportTicketMessage[];
}
