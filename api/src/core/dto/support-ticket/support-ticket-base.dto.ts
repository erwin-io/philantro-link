import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsDateString,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumberString,
  Matches,
  ValidateNested,
} from "class-validator";
import moment from "moment";
import { MapDto } from "../map/map.dto";

export class DefaultSupportTicketDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, title is required!"
  })
  title: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, description is required!"
  })
  description: string;
  
}

export class SupportTicketMessageDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, supportTicketCode is required!"
  })
  supportTicketCode: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, userCode is required!"
  })
  userCode: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, message is required!"
  })
  message: string;
}