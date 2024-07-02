import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";
import {
  DELETE_SUCCESS,
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
} from "src/common/constant/api-response.constant";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { SupportTicketMessageDto } from "src/core/dto/support-ticket/support-ticket-base.dto";
import { CreateSupportTicketDto } from "src/core/dto/support-ticket/support-ticket.create.dto";
import {
  UpdateSupportTicketDto,
  UpdateSupportTicketStatusDto,
} from "src/core/dto/support-ticket/support-ticket.update.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { SupportTicket } from "src/db/entities/SupportTicket";
import { SupportTicketMessage } from "src/db/entities/SupportTicketMessage";
import { SupportTicketService } from "src/services/support-ticket.service";

@ApiTags("support-ticket")
@Controller("support-ticket")
export class SupportTicketController {
  constructor(private readonly supportTicketService: SupportTicketService) {}

  @Get("/:supportTicketCode")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("supportTicketCode") supportTicketCode: string) {
    const res = {} as ApiResponseModel<SupportTicket>;
    try {
      res.data = await this.supportTicketService.getByCode(supportTicketCode);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/page")
  //   @UseGuards(JwtAuthGuard)
  async getPaginated(@Body() params: PaginationParamsDto) {
    const res: ApiResponseModel<{
      results: SupportTicket[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.supportTicketService.getPagination(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("")
  //   @UseGuards(JwtAuthGuard)
  async createSupportTicket(@Body() dto: CreateSupportTicketDto) {
    const res: ApiResponseModel<SupportTicket> = {} as any;
    try {
      res.data = await this.supportTicketService.createSupportTicket(dto);
      res.success = true;
      res.message = `Support Ticket ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:supportTicketCode")
  //   @UseGuards(JwtAuthGuard)
  async updateSupportTicket(
    @Param("supportTicketCode") supportTicketCode: string,
    @Body() dto: UpdateSupportTicketDto
  ) {
    const res: ApiResponseModel<SupportTicket> = {} as any;
    try {
      res.data = await this.supportTicketService.updateSupportTicket(
        supportTicketCode,
        dto
      );
      res.success = true;
      res.message = `Support Ticket ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateStatus/:supportTicketCode")
  //   @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param("supportTicketCode") supportTicketCode: string,
    @Body() dto: UpdateSupportTicketStatusDto
  ) {
    const res: ApiResponseModel<SupportTicket> = {} as any;
    try {
      res.data = await this.supportTicketService.updateStatus(
        supportTicketCode,
        dto
      );
      res.success = true;
      res.message = `Support Ticket status ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/message/page")
  //   @UseGuards(JwtAuthGuard)
  async getMessagePaginated(@Body() params: PaginationParamsDto) {
    const res: ApiResponseModel<{
      results: SupportTicketMessage[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.supportTicketService.getMessagePagination(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/message/")
  //   @UseGuards(JwtAuthGuard)
  async postMessage(@Body() dto: SupportTicketMessageDto) {
    const res: ApiResponseModel<SupportTicketMessage> = {} as any;
    try {
      res.data = await this.supportTicketService.postMessage(dto);
      res.success = true;
      res.message = `Support Ticket Message Sent!`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
