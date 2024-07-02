import { IsNotEmpty } from "class-validator";
import { Match } from "../match.decorator.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @Match("password")
  @IsNotEmpty()
  confirmPassword: string;
}


export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @Match("password")
  @IsNotEmpty()
  confirmPassword: string;
}
