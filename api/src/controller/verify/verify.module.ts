import { Module } from "@nestjs/common";
import { VerifyController } from "./verify.controller";
import { TransactionsService } from "src/services/transactions.service";
import { Transactions } from "src/db/entities/Transactions";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { AuthService } from "src/services/auth.service";
import { Users } from "src/db/entities/Users";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { NotificationsModule } from "../notifications/notifications.module";
import { UsersModule } from "../users/users.module";
import { EmailService } from "src/services/email.service";

@Module({
  imports: [
    FirebaseProviderModule,
    HttpModule,
    UsersModule,
    NotificationsModule,
    PassportModule.register({}),
    JwtModule.register({}),
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [VerifyController],
  providers: [AuthService, EmailService],
})
export class VerifyModule {}
