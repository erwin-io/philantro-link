import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsBooleanString,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from "class-validator";

export class RequirementDto {
  @ApiProperty()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty()
  @ValidateIf((o) => {
    return o.noChanges === true || o.noChanges.toString() === "true";
  })
  base64: string;

  @ApiProperty()
  @IsOptional()
  noChanges = false;
}
