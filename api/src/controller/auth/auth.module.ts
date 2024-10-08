import { Module } from "@nestjs/common";
import { AuthService } from "../../services/auth.service";
import { LocalStrategy } from "../../core/auth/local.strategy";
import { JwtStrategy } from "../../core/auth/jwt.strategy";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/db/entities/Users";
import { NotificationsService } from "src/services/notifications.service";
import { NotificationsModule } from "../notifications/notifications.module";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { EmailService } from "src/services/email.service";
import { UserConversationModule } from "../user-conversation/user-conversation.module";

@Module({
  imports: [
    FirebaseProviderModule,
    UsersModule,
    NotificationsModule,
    UserConversationModule,
    PassportModule.register({}),
    JwtModule.register({}),
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, EmailService],
  exports: [AuthService, EmailService],
})
export class AuthModule {}
