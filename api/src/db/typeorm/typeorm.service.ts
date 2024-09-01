import { Users } from "../entities/Users";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, Inject } from "@nestjs/common";
import { Access } from "../entities/Access";
import { Notifications } from "../entities/Notifications";
import { UserProfilePic } from "../entities/UserProfilePic";
import { Files } from "../entities/Files";
import { UserOneSignalSubscription } from "../entities/UserOneSignalSubscription";
import { SystemConfig } from "../entities/SystemConfig";
import { Events } from "../entities/Events";
import { EventImage } from "../entities/EventImage";
import { EventMessage } from "../entities/EventMessage";
import { Transactions } from "../entities/Transactions";
import { Interested } from "../entities/Interested";
import { Responded } from "../entities/Responded";
import { SupportTicket } from "../entities/SupportTicket";
import { SupportTicketMessage } from "../entities/SupportTicketMessage";
import { UserConversation } from "../entities/UserConversation";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const ssl = this.config.get<string>("SSL");
    const config: TypeOrmModuleOptions = {
      type: "postgres",
      host: this.config.get<string>("DATABASE_HOST"),
      port: Number(this.config.get<number>("DATABASE_PORT")),
      database: this.config.get<string>("DATABASE_NAME"),
      username: this.config.get<string>("DATABASE_USER"),
      password: this.config.get<string>("DATABASE_PASSWORD"),
      entities: [
        Users,
        UserProfilePic,
        Files,
        Access,
        Notifications,
        UserOneSignalSubscription,
        SystemConfig,
        Events,
        EventImage,
        EventMessage,
        Transactions,
        Interested,
        Responded,
        SupportTicket,
        SupportTicketMessage,
        UserConversation
      ],
      synchronize: false, // never use TRUE in production!
      ssl: ssl.toLocaleLowerCase().includes("true"),
      extra: {},
    };
    if (config.ssl) {
      config.extra.ssl = {
        require: true,
        rejectUnauthorized: false,
      };
    }
    return config;
  }
}
