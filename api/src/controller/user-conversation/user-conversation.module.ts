import { Module } from "@nestjs/common";
import { UserConversationController } from "./user-conversation.controller";
import { UserConversationService } from "src/services/user-conversation.service";
import { UserConversation } from "src/db/entities/UserConversation";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { OneSignalNotificationService } from "src/services/one-signal-notification.service";
import { SupportTicket } from "src/db/entities/SupportTicket";
import { Events } from "src/db/entities/Events";
import { EventMessage } from "src/db/entities/EventMessage";

@Module({
  imports: [
    FirebaseProviderModule,
    HttpModule,
    TypeOrmModule.forFeature([
      UserConversation,
      Events,
      SupportTicket,
      EventMessage,
    ]),
  ],
  controllers: [UserConversationController],
  providers: [UserConversationService, OneSignalNotificationService],
  exports: [UserConversationService, OneSignalNotificationService],
})
export class UserConversationModule {}
