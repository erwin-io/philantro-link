import { AccessPages } from "src/app/model/access.model";
import { ColumnDefinition } from "./table"

export interface AppConfig {
    appName: string;
    reservationConfig: {
      maxCancellation: string;
      daysCancellationLimitReset: string;
      timeSlotHours: {
        start: string;
        end: string;
      };
      timeSlotNotAvailableHours: string[];
      dayOfWeekNotAvailable: string[];
    };
    tableColumns: {
      users: ColumnDefinition[];
      access: ColumnDefinition[];
      transactions: ColumnDefinition[];
      events: ColumnDefinition[];
      activeEvents: ColumnDefinition[];
      supportTicket: ColumnDefinition[];
    };
    sessionConfig: {
      sessionTimeout: string;
    };
    lookup: {
      accessPages: AccessPages[];
    };
    apiEndPoints: {
      auth: {
        login: string;
        registerClient: string;
      };
      user: {
        getByCode: string;
        createClientUser: string;
        createAdminUser: string;
        updateAdminProfile: string;
        updateClientUser: string;
        updateAdminUser: string;
        getUsersByAdvanceSearch: string;
        updateUserPassword: string;
        profileResetPassword: string;
        approveAccessRequest: string;
        delete: string;
      };
      access: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
        update: string;
        delete: string;
      };
      events: {
        getByAdvanceSearch: string;
        getByCode: string;
        createCharityVolunteerEvent: string;
        createDonationEvent: string;
        createAssistanceEvent: string;
        updateCharityVolunteerEvent: string;
        updateDonationEvent: string;
        updateAssistanceEvent: string;
        updateStatus: string;
      },
      transactions: {
        getByCode: string;
        getByAdvanceSearch: string;
        getPaymentLink: string;
        requestPaymentLink: string;
        expirePaymentLink: string;
        comleteTopUpPayment: string;
      },
      supportTicket: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
        update: string;
        updateStatus: string;
        getMessageByAdvanceSearch: string;
        postMessage: string;
      },
      notifications: {
        getByAdvanceSearch: string;
        getUnreadByUser: string;
        marAsRead: string;
      };
      settings: {
        getAll: string;
        find: string;
        update: string;
        uploadCertificateTemplate: string;
      };
      dashboard: {
        getDashboardSummary: string;
        getEventsByGeo: string;
      };
      message: { create: string };
    };
  }
