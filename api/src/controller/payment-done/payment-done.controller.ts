import { extname } from "path";
import { Controller, Get, Param, Render, Req } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import {
  PAYMENT_LINK_STATUS,
  PAYMENT_STATUS,
} from "src/common/constant/payment.constant";
import { TransactionsService } from "src/services/transactions.service";

@Controller({
  path: "payment-done",
})
@ApiExcludeController()
export class PaymentDoneController {
  constructor(private readonly transactionsService: TransactionsService) {}
  @Get("")
  @Render("payment-done")
  async get(@Req() req) {
    try {
      const transactionCode = req.params["0"];
      if (transactionCode && transactionCode !== "") {
        return this.paymentDetails(transactionCode);
      } else {
        return {
          invalidUrl: true,
          title: "Payment incomplete",
          cssFile: "/css/payment-done.css",
          jsFile: "/js/payment-done.js",
          layout: "layouts/main-layout",
        };
      }
    } catch (ex) {
      return {
        invalidUrl: true,
        title: "Payment incomplete",
        cssFile: "/css/payment-done.css",
        jsFile: "/js/payment-done.js",
        layout: "layouts/main-layout",
      };
    }
  }
  @Get("/:transactionCode")
  @Render("payment-done")
  async getByCode(@Param("transactionCode") transactionCode: string) {
    try {
      if (transactionCode && transactionCode !== "") {
        return this.paymentDetails(transactionCode);
      } else {
        return {
          invalidUrl: true,
          title: "Payment incomplete",
          cssFile: "/css/payment-done.css",
          jsFile: "/js/payment-done.js",
          layout: "layouts/main-layout",
        };
      }
    } catch (ex) {
      return {
        invalidUrl: true,
        title: "Payment incomplete",
        cssFile: "/css/payment-done.css",
        jsFile: "/js/payment-done.js",
        layout: "layouts/main-layout",
      };
    }
  }

  async paymentDetails(transactionCode) {
    try {
      let transaction = await this.transactionsService.getByCode(
        transactionCode
      );
      if (
        transaction &&
        transaction?.paymentData &&
        (transaction?.status !== PAYMENT_STATUS.COMPLETED ||
          !transaction?.isCompleted) &&
        transaction?.paymentData?.paid
      ) {
        await this.transactionsService.comleteTopUpPayment(
          transaction?.transactionCode
        );
        transaction = await this.transactionsService.getByCode(transactionCode);
        return {
          transaction,
          title: "Payment success",
          cssFile: "/css/payment-done.css",
          jsFile: "/js/payment-done.js",
          layout: "layouts/main-layout",
        };
      } else if (
        transaction &&
        transaction?.paymentData &&
        (transaction?.status === PAYMENT_STATUS.COMPLETED ||
          transaction?.isCompleted) &&
        transaction?.paymentData?.paid
      ) {
        transaction = await this.transactionsService.getByCode(transactionCode);
        return {
          transaction,
          title: "Payment success",
          cssFile: "/css/payment-done.css",
          jsFile: "/js/payment-done.js",
          layout: "layouts/main-layout",
        };
      } else if (
        transaction &&
        transaction?.paymentData &&
        !transaction?.paymentData?.paid
      ) {
        await this.transactionsService.expirePaymentLink(
          transaction?.referenceCode
        );
        return {
          transaction,
          title: "Payment incomplete",
          cssFile: "/css/payment-done.css",
          jsFile: "/js/payment-done.js",
          layout: "layouts/main-layout",
        };
      } else {
        return {
          transaction,
          title: "Payment incomplete",
          cssFile: "/css/payment-done.css",
          jsFile: "/js/payment-done.js",
          layout: "layouts/main-layout",
        };
      }
    } catch (ex) {
      return {
        invalidUrl: true,
        title: "Payment incomplete",
        cssFile: "/css/payment-done.css",
        jsFile: "/js/payment-done.js",
        layout: "layouts/main-layout",
      };
    }
  }
}
