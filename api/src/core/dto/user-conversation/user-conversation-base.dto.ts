import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumberString,
  IsOptional,
  IsUppercase,
  ValidateNested,
} from "class-validator";
import { MapDto } from "../map/map.dto";

export class UserConversationDto {
  @ApiProperty()
  @IsNotEmpty()
  eventCode: string;

  @ApiProperty()
  @IsNotEmpty()
  fromUserCode: string;

  @ApiProperty()
  @IsNotEmpty()
  toUserCode: string;

  @ApiProperty()
  @IsNotEmpty()
  message: string;
}