import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from "@nestjs/common";
import { ApiBody, ApiProperty, ApiQuery, ApiTags } from "@nestjs/swagger";
import {
  DELETE_SUCCESS,
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
} from "src/common/constant/api-response.constant";
import {
  CreateAssistanceEventDto,
  CreateCharityVolunteerEventDto,
  CreateDonationEventDto,
} from "src/core/dto/events/events.create.dto";
import {
  UpdateAssistanceEventDto,
  UpdateCharityVolunteerEventDto,
  UpdateDonationEventDto,
  UpdateEventInterestedDto,
  UpdateEventRespondedDto,
  UpdateEventStatusDto,
} from "src/core/dto/events/events.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Events } from "src/db/entities/Events";
import { EventsService } from "src/services/events.service";
import { createReadStream } from "fs";
import { Response } from "express";
import { extname } from "path";
import { IsNotEmpty, IsNumberString, IsArray } from "class-validator";
import { Transform } from "class-transformer";

export class EventPaginationParamsDto {
  @ApiProperty({
    default: 10,
  })
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  pageSize: string;

  @ApiProperty({
    default: 0,
  })
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  pageIndex: string;

  @ApiProperty({})
  @IsNotEmpty()
  order = {} as any;

  @ApiProperty({})
  @IsNotEmpty()
  userCode: string;
}

@ApiTags("events")
@Controller("events")
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Get("/:eventCode")
  //   @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: "currentUserCode",
    required: false,
    description: "Current User code",
  })
  async getDetails(
    @Param("eventCode") eventCode: string,
    @Query("currentUserCode") currentUserCode
  ) {
    const res = {} as ApiResponseModel<Events>;
    try {
      res.data = await this.eventService.getByCode(eventCode, currentUserCode);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("thumbnail/:eventCode")
  //   @UseGuards(JwtAuthGuard)
  async getEventThumbnail(
    @Param("eventCode") eventCode: string,
    @Res() res: Response
  ) {
    const file = await this.eventService.getEventThumbnailFile(eventCode);
    if (file) {
      const extName = extname(file.fileName);
      const filePath = `events/${eventCode}/${file.guid}${extName}`;
      const fileContent = await this.eventService.getEventThumbnailContent(
        filePath
      );
      res.set({
        "Content-Type": `img/${extName.split(".")[1]}`,
        "Content-Disposition": `attachment; filename="${file.fileName}"`,
      });
      res.send(fileContent);
    } else {
      res.send(null);
    }
  }

  @Post("/page")
  //   @UseGuards(JwtAuthGuard)
  async getPaginated(@Body() params: PaginationParamsDto) {
    const res: ApiResponseModel<{
      results: Events[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.eventService.getPagination(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/getPageJoinedEvents")
  async getPageJoinedEvents(@Body() params: EventPaginationParamsDto) {
    const res: ApiResponseModel<{
      results: Events[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.eventService.getPageJoinedEvents(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/getPageInterestedEvents")
  async getPageInterestedEvents(@Body() params: EventPaginationParamsDto) {
    const res: ApiResponseModel<{
      results: Events[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.eventService.getPageInterestedEvents(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("createCharityVolunteerEvent")
  //   @UseGuards(JwtAuthGuard)
  async createCharityVolunteerEvent(
    @Body() dto: CreateCharityVolunteerEventDto
  ) {
    const res: ApiResponseModel<Events> = {} as any;
    try {
      res.data = await this.eventService.createCharityVolunteerEvent(dto);
      res.success = true;
      res.message = `Event ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("createDonationEvent")
  //   @UseGuards(JwtAuthGuard)
  async createDonationEvent(@Body() dto: CreateDonationEventDto) {
    const res: ApiResponseModel<Events> = {} as any;
    try {
      res.data = await this.eventService.createDonationEvent(dto);
      res.success = true;
      res.message = `Event ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("createAssistanceEvent")
  //   @UseGuards(JwtAuthGuard)
  async createAssistanceEvent(@Body() dto: CreateAssistanceEventDto) {
    const res: ApiResponseModel<Events> = {} as any;
    try {
      res.data = await this.eventService.createAssistanceEvent(dto);
      res.success = true;
      res.message = `Event ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateCharityVolunteerEvent/:eventCode")
  //   @UseGuards(JwtAuthGuard)
  async updateCharityVolunteerEvent(
    @Param("eventCode") eventCode: string,
    @Body() dto: UpdateCharityVolunteerEventDto
  ) {
    const res: ApiResponseModel<Events> = {} as any;
    try {
      res.data = await this.eventService.updateCharityVolunteerEvent(
        eventCode,
        dto
      );
      res.success = true;
      res.message = `Event ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateDonationEvent/:eventCode")
  //   @UseGuards(JwtAuthGuard)
  async updateDonationEvent(
    @Param("eventCode") eventCode: string,
    @Body() dto: UpdateDonationEventDto
  ) {
    const res: ApiResponseModel<Events> = {} as any;
    try {
      res.data = await this.eventService.updateDonationEvent(eventCode, dto);
      res.success = true;
      res.message = `Event ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateAssistanceEvent/:eventCode")
  //   @UseGuards(JwtAuthGuard)
  async updateAssistanceEvent(
    @Param("eventCode") eventCode: string,
    @Body() dto: UpdateAssistanceEventDto
  ) {
    const res: ApiResponseModel<Events> = {} as any;
    try {
      res.data = await this.eventService.updateAssistanceEvent(eventCode, dto);
      res.success = true;
      res.message = `Event ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateStatus/:eventCode")
  //   @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param("eventCode") eventCode: string,
    @Body() dto: UpdateEventStatusDto
  ) {
    const res: ApiResponseModel<Events> = {} as any;
    try {
      res.data = await this.eventService.updateStatus(eventCode, dto);
      res.success = true;
      res.message = `Event status ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateEventInterested/:eventCode")
  //   @UseGuards(JwtAuthGuard)
  async updateEventInterested(
    @Param("eventCode") eventCode: string,
    @Body() dto: UpdateEventInterestedDto
  ) {
    const res: ApiResponseModel<Events> = {} as any;
    try {
      res.data = await this.eventService.updateEventInterested(eventCode, dto);
      res.success = true;
      res.message = `Event ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateEventResponded/:eventCode")
  //   @UseGuards(JwtAuthGuard)
  async updateEventResponded(
    @Param("eventCode") eventCode: string,
    @Body() dto: UpdateEventRespondedDto
  ) {
    const res: ApiResponseModel<Events> = {} as any;
    try {
      res.data = await this.eventService.updateEventResponded(eventCode, dto);
      res.success = true;
      res.message = `Event ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
