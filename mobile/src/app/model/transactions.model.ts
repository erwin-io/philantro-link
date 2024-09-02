import { Events } from "./events.model";
import { Users } from "./users";

export interface Transactions {
  transactionId: string;
  transactionCode: any;
  dateTime: string;
  amount: string;
  referenceCode: string;
  paymentType: string;
  fromAccountNumber: string;
  fromAccountName: string;
  toAccountNumber: string;
  toAccountName: string;
  isCompleted: boolean;
  bank: string;
  status: string;
  user: Users;
  event: Events;
}

