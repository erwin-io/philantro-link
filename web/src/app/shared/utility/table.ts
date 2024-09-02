export class ColumnDefinition {
  name: string;
  label: string;
  apiNotation?: string;
  sticky?: boolean;
  style?: ColumnStyle;
  controls?: boolean;
  disableSorting?: boolean;
  format?: {
    type: "currency" | "date" | "date-time" | "number" | "custom" | "image";
    custom: string;
  };
  hide?: boolean;
  type?: "string" | "boolean" | "date" | "number" = "string";
  filterOptions: ColumnDefinitionFilterOptions;
  urlPropertyName?: string;
  filter: any;
}

export class ColumnDefinitionFilterOptions {
  placeholder?: string;
  enable?: boolean;
  type?: "text" | "option" | "option-yes-no" | "date" | "date-range" | "number" | "number-range" | "precise";
};
export class ColumnStyle {
  width: string;
  left: string;
}

export class TableColumnBase {
  menu: any[] = [];
}

export class UsersTableColumn {
  userName: string;
  name: string;
  userType: string;
  mobileNumber: string;
  enable: boolean;
  userProfilePic?: string;
  url?: string;
}

export class UserTableColumn {
  userCode?: string;
  name?: string;
  mobileNumber?: string;
  userProfilePic?: string;
}

export class AccessTableColumn {
  accessId: string;
  accessCode: string;
  name?: string;
  url?: string;
}

export class EventsTableColumn {
  eventCode?: string;
  dateTime?: string;
  eventType?: string;
  eventName?: string;
  eventLocName?: string;
  inProgress?: boolean;
  user?: string;
  url?: string;
}

export class TransactionsTableColumn {
  transactionCode?: string;
  dateTime?: string;
  amount?: string;
  paymentType?: string;
  user?: string;
  from?: string;
  fromEmail?: string;
}

export class SupportTicketTableColumn {
  supportTicketCode?: string;
  dateTimeSent?: string;
  type?: string;
  title?: string;
  user?: string;
  url?: string;
}
