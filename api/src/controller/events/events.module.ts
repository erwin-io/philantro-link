import { Module } from "@nestjs/common";
import { EventsController } from "./events.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { OneSignalNotificationService } from "src/services/one-signal-notification.service";
import { Events } from "src/db/entities/Events";
import { EventsService } from "src/services/events.service";

@Module({
  imports: [
    FirebaseProviderModule,
    HttpModule,
    TypeOrmModule.forFeature([Events]),
  ],
  controllers: [EventsController],
  providers: [EventsService, OneSignalNotificationService],
  exports: [EventsService, OneSignalNotificationService],
})
export class EventsModule {}
