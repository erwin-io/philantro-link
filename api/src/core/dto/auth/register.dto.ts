import { Transform, Type } from "class-transformer";
import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
  IsIn,
  IsOptional,
} from "class-validator";
import { Match } from "../match.decorator.dto";
import { ApiProperty } from "@nestjs/swagger";
import { DefaultUserDto } from "../user/user-base.dto";

export class RegisterClientUserDto extends DefaultUserDto {

  @ApiProperty()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "Help/Assistance types",
    example: [],
    isArray: true,
    enum: ["WATER", "FOOD", "CLOTHING", "SERVICES"],
    default: []
  })
  @IsArray()
  @IsIn(["WATER", "FOOD", "CLOTHING", "SERVICES"], { each: true })
  @IsOptional()
  helpNotifPreferences: string[] = [];
}