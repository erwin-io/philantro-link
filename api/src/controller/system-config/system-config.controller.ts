/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  Res,
  StreamableFile,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Put,
  Query,
} from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { ApiResponseModel } from "src/core/models/api-response.model";
import fs from "fs";
import moment from "moment";
import { ConfigService } from "@nestjs/config";
import { getEnvPath } from "src/common/utils/utils";
import path from "path";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import {
  UpdateSystemConfigDto,
  UploadCertificateTemplateDto,
} from "src/core/dto/system-config/system-config.dto";
import { SystemConfig } from "src/db/entities/SystemConfig";
import { SystemConfigService } from "src/services/system-config.service";
import e from "express";
import { UPDATE_SUCCESS } from "src/common/constant/api-response.constant";

@ApiTags("system-config")
@Controller("system-config")
export class SystemConfigController {
  constructor(private readonly systemConfigService: SystemConfigService) {}


  @Get("/getServerDate")
  //   @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: "date",
    required: false,
    description: "Date",
  })
  async getServerDate(@Query("date") date) {
    const res: ApiResponseModel<any> = {} as any;
    try {
      res.data = await this.systemConfigService.getServerDate(date);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
  
  @Get("")
  //   @UseGuards(JwtAuthGuard)
  async getAll() {
    const res: ApiResponseModel<SystemConfig[]> = {} as any;
    try {
      res.data = await this.systemConfigService.getAll();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("/:key")
  //   @UseGuards(JwtAuthGuard)
  async find(@Param("key") key: string) {
    const res: ApiResponseModel<SystemConfig> = {} as any;
    try {
      res.data = await this.systemConfigService.find(key);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("")
  //   @UseGuards(JwtAuthGuard)
  async update(@Body() dto: UpdateSystemConfigDto) {
    const res: ApiResponseModel<SystemConfig> = {} as any;
    try {
      res.data = await this.systemConfigService.update(dto);
      res.success = true;
      res.message = `Setings ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
