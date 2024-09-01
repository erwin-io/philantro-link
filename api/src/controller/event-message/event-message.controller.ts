import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateEventMessageDto } from "src/core/dto/event-message/event-message.create.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { EventMessage } from "src/db/entities/EventMessage";
import { EventMessageService } from "src/services/event-message.service";

@ApiTags("event-message")
@Controller("event-message")
export class EventMessageController {
  constructor(private readonly eventMessageService: EventMessageService) {}

  @Post("/page")
  //   @UseGuards(JwtAuthGuard)
  async getPaginated(@Body() params: PaginationParamsDto) {
    const res: ApiResponseModel<{
      results: EventMessage[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.eventMessageService.getPagination(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/")
  //   @UseGuards(JwtAuthGuard)
  async create(@Body() params: CreateEventMessageDto) {
    const res: ApiResponseModel<EventMessage> = {} as any;
    try {
      res.data = await this.eventMessageService.create(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
