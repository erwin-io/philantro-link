import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString } from "class-validator";

export class MapDto {
  @ApiProperty()
  @IsNotEmpty()
  latitude: string;

  @ApiProperty()
  @IsNotEmpty()
  longitude: string;
}
