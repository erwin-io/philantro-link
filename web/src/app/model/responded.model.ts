
import { Events } from "./events.model";
import { Users } from "./users";
export class Responded {
  eventId: string;
  event: Events;
  user: Users;
}
