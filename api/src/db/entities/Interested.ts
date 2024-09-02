import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Events } from "./Events";
import { Users } from "./Users";

@Index("Interested_pkey", ["id"], { unique: true })
@Entity("Interested", { schema: "dbo" })
export class Interested {
  @PrimaryGeneratedColumn({ type: "bigint", name: "Id" })
  id: string;

  @ManyToOne(() => Events, (events) => events.interesteds)
  @JoinColumn([{ name: "EventId", referencedColumnName: "eventId" }])
  event: Events;

  @ManyToOne(() => Users, (users) => users.interesteds)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;
}
