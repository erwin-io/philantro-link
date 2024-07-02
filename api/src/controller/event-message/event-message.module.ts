import { Module } from "@nestjs/common";
import { EventMessageController } from "./event-message.controller";
import { EventMessageService } from "src/services/event-message.service";
import { EventMessage } from "src/db/entities/EventMessage";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { OneSignalNotificationService } from "src/services/one-signal-notification.service";

@Module({
  imports: [
    FirebaseProviderModule,
    HttpModule,
    TypeOrmModule.forFeature([EventMessage]),
  ],
  controllers: [EventMessageController],
  providers: [EventMessageService, OneSignalNotificationService],
  exports: [EventMessageService, OneSignalNotificationService],
})
export class EventMessageModule {}
