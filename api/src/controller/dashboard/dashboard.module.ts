import { Module } from "@nestjs/common";
import { Events } from "src/db/entities/Events";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "src/services/dashboard.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/db/entities/Users";
import { Transactions } from "src/db/entities/Transactions";
import { SupportTicket } from "src/db/entities/SupportTicket";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Events, SupportTicket, Transactions]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
