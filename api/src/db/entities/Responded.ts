import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Events } from "./Events";
import { Users } from "./Users";

@Index("Responded_pkey", ["id"], { unique: true })
@Entity("Responded", { schema: "dbo" })
export class Responded {
  @PrimaryGeneratedColumn({ type: "bigint", name: "Id" })
  id: string;

  @ManyToOne(() => Events, (events) => events.respondeds)
  @JoinColumn([{ name: "EventId", referencedColumnName: "eventId" }])
  event: Events;

  @ManyToOne(() => Users, (users) => users.respondeds)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;
}
