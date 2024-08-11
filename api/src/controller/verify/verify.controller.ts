import { extname } from "path";
import { Controller, Get, Param, Render, Req } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import {
  PAYMENT_LINK_STATUS,
  PAYMENT_STATUS,
} from "src/common/constant/payment.constant";
import { TransactionsService } from "src/services/transactions.service";
import { compare } from "src/common/utils/utils";
import { AuthService } from "src/services/auth.service";
import { ConfigService } from "@nestjs/config";

@Controller({
  path: "verify",
})
@ApiExcludeController()
export class VerifyController {
  constructor(
    private authService: AuthService,
    private readonly config: ConfigService
  ) {}
  @Get("")
  @Render("verify")
  async get(@Req() req) {
    try {
      const queryParams = req.query; // Access query parameters from raw request object
      const userCode = queryParams["user"]; // Access specific query parameter
      const hashOTP = queryParams["code"]; // Access specific query parameter

      if (!userCode || !hashOTP) {
        throw new Error("Invalid url");
      }

      const isVerified = await this.authService.verifyUser(userCode, hashOTP);
      if (isVerified) {
        return {
          isVerified,
          company: this.config.get<string>("EV_COMPANY"),
          year: new Date().getFullYear().toString(),
          deepLink: "philantrolink://landing-page",
          title: "Verificaton",
          cssFile: "/css/verify.css",
          jsFile: "/js/verify.js",
          layout: "layouts/main-layout",
        };
      } else {
        return {
          invalidUrl: true,
          message: "Invalid url",
          company: this.config.get<string>("EV_COMPANY"),
          year: new Date().getFullYear().toString(),
          title: "Verificaton",
          cssFile: "/css/verify.css",
          jsFile: "/js/verify.js",
          layout: "layouts/main-layout",
        };
      }
    } catch (ex) {
      return {
        invalidUrl: true,
        exist: ex?.message && ex?.message.includes("already verified"),
        message: ex?.message,
        company: this.config.get<string>("EV_COMPANY"),
        year: new Date().getFullYear().toString(),
        title: "Verificaton failed",
        cssFile: "/css/verify.css",
        jsFile: "/js/verify.js",
        layout: "layouts/main-layout",
      };
    }
  }
}
