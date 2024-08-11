import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./db/typeorm/typeorm.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./controller/auth/auth.module";
import * as Joi from "@hapi/joi";
import { getEnvPath } from "./common/utils/utils";
import { UsersModule } from "./controller/users/users.module";
import { AccessModule } from "./controller/access/access.module";
import { FirebaseProviderModule } from "./core/provider/firebase/firebase-provider.module";
import { NotificationsModule } from "./controller/notifications/notifications.module";
import { ReminderModule } from "./controller/reminder/reminder.module";
import { SystemConfigModule } from "./controller/system-config/system-config.module";
import { DashboardModule } from "./controller/dashboard/dashboard.module";
import { EventsModule } from "./controller/events/events.module";
import { TransactionsModule } from "./controller/transactions/transactions.module";
import { PaymentDoneModule } from "./controller/payment-done/payment-done.module";
import { SupportTicketModule } from "./controller/support-ticket/support-ticket.module";
import { MessageService } from "./services/message.service";
import { EmailService } from "./services/email.service";
import { VerifyModule } from "./controller/verify/verify.module";
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      validationSchema: Joi.object({
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    UsersModule,
    AccessModule,
    NotificationsModule,
    FirebaseProviderModule,
    ReminderModule,
    SystemConfigModule,
    DashboardModule,
    EventsModule,
    TransactionsModule,
    PaymentDoneModule,
    SupportTicketModule,
    VerifyModule,
  ],
  providers: [AppService, MessageService, EmailService],
  controllers: [],
})
export class AppModule {}
