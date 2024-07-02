import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Events } from "./Events";
import { Users } from "./Users";

@Index("Responded_pkey", ["userId"], { unique: true })
@Entity("Responded", { schema: "dbo" })
export class Responded {
  @Column("bigint", { primary: true, name: "UserId" })
  userId: string;

  @ManyToOne(() => Events, (events) => events.respondeds)
  @JoinColumn([{ name: "EventId", referencedColumnName: "eventId" }])
  event: Events;

  @OneToOne(() => Users, (users) => users.responded)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;
}
