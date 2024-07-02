import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateSystemConfigDto {
  @ApiProperty({
    description: "Key of the system config",
    default: "key"
  })
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: "Value of the system config",
    default: "value"
  })
  @IsNotEmpty()
  value: string;
}

export class UploadCertificateTemplateDto {
  @ApiProperty()
  @IsOptional()
  fileName: any;

  @ApiProperty()
  @IsOptional()
  base64: any;
}