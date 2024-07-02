import { Module } from "@nestjs/common";
import { PaymentDoneController } from "./payment-done.controller";
import { TransactionsService } from "src/services/transactions.service";
import { Transactions } from "src/db/entities/Transactions";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";

@Module({
  imports: [
    FirebaseProviderModule,
    HttpModule,
    TypeOrmModule.forFeature([Transactions]),
  ],
  controllers: [PaymentDoneController],
  providers: [TransactionsService],
})
export class PaymentDoneModule {}
