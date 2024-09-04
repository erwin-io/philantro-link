import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumberString,
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
  IsBooleanString,
  IsDateString,
  IsEmail,
  IsIn,
  IsOptional,
  IsUppercase,
  Matches,
} from "class-validator";
import { DefaultUserDto } from "./user-base.dto";

export class UpdateClientUserDto extends DefaultUserDto {
}

export class UpdateAdminUserDto extends DefaultUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  accessCode: string;
}

export class UpdateUserProfileDto extends DefaultUserDto {
  @ApiProperty()
  @IsOptional()
  userProfilePic: any;
}

export class UpdateClientUserProfileDto extends DefaultUserDto {
  @ApiProperty()
  @IsOptional()
  userProfilePic: any;

  @ApiProperty({
    description: "Help/Assistance types",
    example: [],
    isArray: true,
    enum: ["WATER", "FOOD", "CLOTHING", "SERVICES"],
    default: []
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(["WATER", "FOOD", "CLOTHING", "SERVICES"], { each: true })
  @IsNotEmpty({
    message: "Not allowed, Help Notif Preferences is required!",
  })
  helpNotifPreferences: string[] = [];
}
