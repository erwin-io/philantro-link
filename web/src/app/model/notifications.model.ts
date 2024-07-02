
import { Users } from "./users";

export class Notifications {
  notificationId: string;
  title: string;
  description: string;
  type: "RESERVATION" | "WORK_ORDER";
  referenceId: string;
  isRead: boolean;
  user: Users;
  date: string;
}
