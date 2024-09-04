import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Index("UserConversation_pkey", ["userConversationId"], { unique: true })
@Entity("UserConversation", { schema: "dbo" })
export class UserConversation {
  @PrimaryGeneratedColumn({ type: "bigint", name: "UserConversationId" })
  userConversationId: string;

  @Column("character varying", { name: "Title" })
  title: string;

  @Column("character varying", { name: "Description" })
  description: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @Column("character varying", { name: "Type" })
  type: string;

  @Column("character varying", { name: "ReferenceId" })
  referenceId: string;

  @Column("character varying", { name: "Status", default: () => "'SENT'" })
  status: string;

  @Column("timestamp with time zone", {
    name: "DateTime",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateTime: Date;

  @ManyToOne(() => Users, (users) => users.userConversations)
  @JoinColumn([{ name: "FromUserId", referencedColumnName: "userId" }])
  fromUser: Users;

  @ManyToOne(() => Users, (users) => users.userConversations2)
  @JoinColumn([{ name: "ToUserId", referencedColumnName: "userId" }])
  toUser: Users;
}
