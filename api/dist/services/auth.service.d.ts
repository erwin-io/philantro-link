import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { Users } from "src/db/entities/Users";
import { NotificationsService } from "./notifications.service";
import { RegisterClientUserDto } from "src/core/dto/auth/register.dto";
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    private notificationService;
    constructor(userRepo: Repository<Users>, jwtService: JwtService, notificationService: NotificationsService);
    registerClient(dto: RegisterClientUserDto): Promise<Users>;
    getByCredentials({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<Users>;
    getAdminByCredentials({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<{
        totalUnreadNotif: number;
        userId: string;
        userName: string;
        password: string;
        accessGranted: boolean;
        active: boolean;
        userCode: string;
        userType: string;
        name: string;
        mobileNumber: string;
        currentLocation: object;
        assistanceType: string[];
        eventImages: import("../db/entities/EventImage").EventImage[];
        eventMessages: import("../db/entities/EventMessage").EventMessage[];
        eventMessages2: import("../db/entities/EventMessage").EventMessage[];
        events: import("../db/entities/Events").Events[];
        interested: import("../db/entities/Interested").Interested;
        notifications: import("../db/entities/Notifications").Notifications[];
        responded: import("../db/entities/Responded").Responded;
        supportTickets: import("../db/entities/SupportTicket").SupportTicket[];
        supportTickets2: import("../db/entities/SupportTicket").SupportTicket[];
        supportTicketMessages: import("../db/entities/SupportTicketMessage").SupportTicketMessage[];
        transactions: import("../db/entities/Transactions").Transactions[];
        userOneSignalSubscriptions: import("../db/entities/UserOneSignalSubscription").UserOneSignalSubscription[];
        userProfilePic: import("../db/entities/UserProfilePic").UserProfilePic;
        access: import("../db/entities/Access").Access;
    }>;
    getClientByCredentials({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<{
        totalUnreadNotif: number;
        userId: string;
        userName: string;
        password: string;
        accessGranted: boolean;
        active: boolean;
        userCode: string;
        userType: string;
        name: string;
        mobileNumber: string;
        currentLocation: object;
        assistanceType: string[];
        eventImages: import("../db/entities/EventImage").EventImage[];
        eventMessages: import("../db/entities/EventMessage").EventMessage[];
        eventMessages2: import("../db/entities/EventMessage").EventMessage[];
        events: import("../db/entities/Events").Events[];
        interested: import("../db/entities/Interested").Interested;
        notifications: import("../db/entities/Notifications").Notifications[];
        responded: import("../db/entities/Responded").Responded;
        supportTickets: import("../db/entities/SupportTicket").SupportTicket[];
        supportTickets2: import("../db/entities/SupportTicket").SupportTicket[];
        supportTicketMessages: import("../db/entities/SupportTicketMessage").SupportTicketMessage[];
        transactions: import("../db/entities/Transactions").Transactions[];
        userOneSignalSubscriptions: import("../db/entities/UserOneSignalSubscription").UserOneSignalSubscription[];
        userProfilePic: import("../db/entities/UserProfilePic").UserProfilePic;
        access: import("../db/entities/Access").Access;
    }>;
}
