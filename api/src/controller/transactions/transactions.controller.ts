import {
  All,
  Body,
  Controller,
  Delete,
  Get,
  Next,
  Param,
  Post,
  Put,
  Req,
  Res,
} from "@nestjs/common";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, Min } from "class-validator";
import { createProxyMiddleware } from "http-proxy-middleware";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Transactions } from "src/db/entities/Transactions";
import { TransactionsService } from "src/services/transactions.service";

export class RequestPaymentDto {
  @ApiProperty({
    type: Number,
    default: 20,
  })
  @IsNumber()
  @Min(20)
  amount: number;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({
    type: String,
  })
  accountNumber: string;
}

@ApiTags("transactions")
@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get("/:transactionCode")
  //   @UseGuards(JwtAuthGuard)
  async getByCode(@Param("transactionCode") transactionCode: string) {
    const res: ApiResponseModel<any> = {} as any;
    try {
      res.data = await this.transactionsService.getByCode(transactionCode);
      res.success = true;
      return res;
    } catch (e) {
      throw e;
    }
  }

  @Post("/page")
  //   @UseGuards(JwtAuthGuard)
  async getPaginated(@Body() params: PaginationParamsDto) {
    const res: ApiResponseModel<{ results: Transactions[]; total: number }> =
      {} as any;
    try {
      res.data = await this.transactionsService.getPagination(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/requestPaymentLink/")
  //   @UseGuards(JwtAuthGuard)
  async requestPaymentLink(@Body() params: RequestPaymentDto) {
    const res: ApiResponseModel<any> = {} as any;
    try {
      res.data = await this.transactionsService.requestPaymentLink(params);
      res.success = true;
      return res;
    } catch (e) {
      throw e;
    }
  }

  @Put("/comleteTopUpPayment/:paymentReferenceCode")
  //   @UseGuards(JwtAuthGuard)
  async comleteTopUpPayment(
    @Param("paymentReferenceCode") paymentReferenceCode: string
  ) {
    const res: ApiResponseModel<any> = {} as any;
    try {
      res.data = await this.transactionsService.comleteTopUpPayment(
        paymentReferenceCode
      );
      res.success = true;
      return res;
    } catch (e) {
      throw e;
    }
  }

  @Delete("/expirePaymentLink/:id")
  //   @UseGuards(JwtAuthGuard)
  async expirePaymentLink(@Param("id") id: string) {
    const res: ApiResponseModel<any> = {} as any;
    try {
      res.data = await this.transactionsService.expirePaymentLink(id);
      res.success = true;
      return res;
    } catch (e) {
      throw e;
    }
  }
}
