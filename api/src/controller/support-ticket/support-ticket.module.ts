import { Module } from "@nestjs/common";
import { SupportTicketController } from "./support-ticket.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { OneSignalNotificationService } from "src/services/one-signal-notification.service";
import { PusherService } from "src/services/pusher.service";
import { SupportTicket } from "src/db/entities/SupportTicket";
import { SupportTicketService } from "src/services/support-ticket.service";
import { SupportTicketMessage } from "src/db/entities/SupportTicketMessage";
import { UserConversation } from "src/db/entities/UserConversation";

@Module({
  imports: [
    FirebaseProviderModule,
    HttpModule,
    TypeOrmModule.forFeature([
      SupportTicket,
      SupportTicketMessage,
      UserConversation,
    ]),
  ],
  controllers: [SupportTicketController],
  providers: [SupportTicketService, OneSignalNotificationService],
  exports: [SupportTicketService, OneSignalNotificationService],
})
export class SupportTicketModule {}
