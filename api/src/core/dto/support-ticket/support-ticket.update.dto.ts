import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsIn,
  IsUppercase,
  IsDateString,
  Matches,
  ValidateIf,
} from "class-validator";
import { DefaultSupportTicketDto } from "./support-ticket-base.dto";

export class UpdateSupportTicketDto extends DefaultSupportTicketDto {
}

export class UpdateSupportTicketStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(["OPEN", "ACTIVE", "COMPLETED", "CLOSED"])
  @IsUppercase()
  status: "OPEN" | "ACTIVE" | "COMPLETED" | "CLOSED";

  @ApiProperty()
  @ValidateIf((o) => o.status !== "OPEN")
  @IsNotEmpty()
  assignedAdminUserCode: string;
}
