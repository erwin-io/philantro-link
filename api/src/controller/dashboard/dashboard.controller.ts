import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Validate,
  ValidateNested,
  ValidationArguments,
} from "class-validator";
import { AnnualFilterDashboardDto } from "src/core/dto/dashboard/dashboard-base.dto";
import { MapDto } from "src/core/dto/map/map.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { SupportTicket } from "src/db/entities/SupportTicket";
import { DashboardService } from "src/services/dashboard.service";
import { ArrayContains } from "typeorm";

export class EventsByGeoDto {
  @ApiProperty()
  @IsOptional()
  @IsIn(["ALL", "PENDING", "REGISTERED"])
  status: string;

  @ApiProperty()
  @IsNotEmpty()
  latitude: string;

  @ApiProperty()
  @IsNotEmpty()
  longitude: string;

  @ApiProperty()
  @IsNotEmpty()
  radius: string;
}

export class ClientEventFeedDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  latitude = 0;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  longitude = 0;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  radius = 0;

  @ApiProperty({
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsNotEmpty({
    message: "Not allowed, eventType is required!",
  })
  eventType: string[];

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  skip = 0;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  limit = 10;
}

export class ClientHelpFeedDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  latitude = 0;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  longitude = 0;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  radius = 0;

  @ApiProperty({
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsNotEmpty({
    message: "Not allowed, helpType is required!",
  })
  helpType: string[];

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  skip = 0;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  limit = 10;
}
@Controller("dashboard")
@ApiTags("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("/getDashboardSummary")
  //   @UseGuards(JwtAuthGuard)
  async getDashboardUsers() {
    const res = {} as ApiResponseModel<any>;
    try {
      res.data = await this.dashboardService.getDashboardSummary();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/getEventsByGeo")
  //   @UseGuards(JwtAuthGuard)
  async getEventsByGeo(@Body() params: EventsByGeoDto) {
    const res: ApiResponseModel<any> = {} as any;
    try {
      res.data = await this.dashboardService.getEventsByGeo(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/getClientEventFeed")
  //   @UseGuards(JwtAuthGuard)
  async getClientEventFeed(@Body() params: ClientEventFeedDto) {
    const res: ApiResponseModel<any> = {} as any;
    try {
      res.data = await this.dashboardService.getClientEventFeed(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/getClientHelpFeed")
  //   @UseGuards(JwtAuthGuard)
  async getClientHelpFeed(@Body() params: ClientHelpFeedDto) {
    const res: ApiResponseModel<any> = {} as any;
    try {
      res.data = await this.dashboardService.getClientHelpFeed(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
