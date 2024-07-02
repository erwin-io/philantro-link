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

@Index("Transactions_pkey", ["transactionId"], { unique: true })
@Entity("Transactions", { schema: "dbo" })
export class Transactions {
  @PrimaryGeneratedColumn({ type: "bigint", name: "TransactionId" })
  transactionId: string;

  @Column("character varying", { name: "TransactionCode", nullable: true })
  transactionCode: string | null;

  @Column("timestamp with time zone", {
    name: "DateTime",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateTime: Date;

  @Column("numeric", { name: "Amount", default: () => "0" })
  amount: string;

  @Column("character varying", { name: "ReferenceCode", default: () => "''" })
  referenceCode: string;

  @Column("character varying", { name: "PaymentType", default: () => "'CASH'" })
  paymentType: string;

  @Column("character varying", {
    name: "FromAccountNumber",
    default: () => "'NA'",
  })
  fromAccountNumber: string;

  @Column("character varying", {
    name: "FromAccountName",
    default: () => "'NA'",
  })
  fromAccountName: string;

  @Column("character varying", {
    name: "ToAccountNumber",
    default: () => "'NA'",
  })
  toAccountNumber: string;

  @Column("character varying", { name: "ToAccountName", default: () => "'NA'" })
  toAccountName: string;

  @Column("boolean", { name: "IsCompleted", default: () => "false" })
  isCompleted: boolean;

  @Column("character varying", { name: "Bank", default: () => "'ONLINE'" })
  bank: string;

  @Column("character varying", { name: "Status", default: () => "'PENDING'" })
  status: string;

  @ManyToOne(() => Events, (events) => events.transactions)
  @JoinColumn([{ name: "EventId", referencedColumnName: "eventId" }])
  event: Events;

  @ManyToOne(() => Users, (users) => users.transactions)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;
}
