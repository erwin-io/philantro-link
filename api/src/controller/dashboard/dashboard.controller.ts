import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { AnnualFilterDashboardDto } from "src/core/dto/dashboard/dashboard-base.dto";
import { MapDto } from "src/core/dto/map/map.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { SupportTicket } from "src/db/entities/SupportTicket";
import { DashboardService } from "src/services/dashboard.service";

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
}
