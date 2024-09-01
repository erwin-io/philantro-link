import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsDateString,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumberString,
  IsOptional,
  Matches,
  ValidateNested,
} from "class-validator";
import moment from "moment";
import { MapDto } from "../map/map.dto";

export class DefaultEventDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, Event name is required!"
  })
  eventName: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, Event description is required!"
  })
  eventDesc: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, Event locations is required!"
  })
  eventLocName: string;

  @ApiProperty({
    isArray: false,
    required: true,
    type: MapDto
  })
  @IsNotEmptyObject()
  @Type(() => MapDto)
  @ValidateNested()
  eventLocMap: MapDto;
  
  @ApiProperty({
    isArray: true,
  })
  @IsOptional()
  eventImages: any[] = [];
}
