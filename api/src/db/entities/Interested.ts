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

@Index("Ratings_pkey", ["userId"], { unique: true })
@Entity("Interested", { schema: "dbo" })
export class Interested {
  @Column("bigint", { primary: true, name: "UserId" })
  userId: string;

  @ManyToOne(() => Events, (events) => events.interesteds)
  @JoinColumn([{ name: "EventId", referencedColumnName: "eventId" }])
  event: Events;

  @OneToOne(() => Users, (users) => users.interested)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;
}
