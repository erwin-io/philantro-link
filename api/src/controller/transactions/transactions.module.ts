import { TransactionsService } from "src/services/transactions.service";
import { Module } from "@nestjs/common";
import { TransactionsController } from "./transactions.controller";
import { HttpModule } from "@nestjs/axios";
import { Transactions } from "src/db/entities/Transactions";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";

@Module({
  imports: [
    FirebaseProviderModule,
    HttpModule,
    TypeOrmModule.forFeature([Transactions]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
