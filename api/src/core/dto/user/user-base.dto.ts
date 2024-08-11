import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsUppercase,
  ValidateNested,
} from "class-validator";
import moment from "moment";

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}

export class DefaultUserDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, name is required!"
  })
  name: string;

  @ApiProperty()
  @IsEmail({
    message: "Not allowed, invalid email format",
  })
  @IsNotEmpty({
    message: "Not allowed, email is required!"
  })
  email: string;
}

export class UpdateProfilePictureDto {
  @ApiProperty()
  @IsOptional()
  userProfilePic: any;
}