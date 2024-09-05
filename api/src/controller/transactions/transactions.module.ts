import { TransactionsService } from "src/services/transactions.service";
import { Module } from "@nestjs/common";
import { TransactionsController } from "./transactions.controller";
import { HttpModule } from "@nestjs/axios";
import { Transactions } from "src/db/entities/Transactions";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { OneSignalNotificationService } from "src/services/one-signal-notification.service";
import { Events } from "src/db/entities/Events";
import { Notifications } from "src/db/entities/Notifications";
import { UserConversation } from "src/db/entities/UserConversation";

@Module({
  imports: [
    FirebaseProviderModule,
    HttpModule,
    TypeOrmModule.forFeature([
      Events,
      UserConversation,
      Notifications,
      Transactions,]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, OneSignalNotificationService],
  exports: [TransactionsService, OneSignalNotificationService],
})
export class TransactionsModule {}
