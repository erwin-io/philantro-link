
import { Users } from './users';

export class Notifications {
  notificationId: string;
  title: string;
  description: string;
  type: 'EVENTS' | 'SUPPORT_TICKET' | 'MESSAGE';
  referenceId: string;
  isRead: boolean;
  user: Users;
  date: string;
}
