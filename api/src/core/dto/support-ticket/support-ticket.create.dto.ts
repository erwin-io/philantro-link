import { Transform } from "class-transformer";
import { DefaultSupportTicketDto } from "./support-ticket-base.dto";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsISO8601,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsUppercase,
  Matches,
} from "class-validator";
import moment from "moment";

export class CreateSupportTicketDto extends DefaultSupportTicketDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(["EVENTS", "TRANSACTIONS"])
  @IsUppercase()
  type: "EVENTS" | "TRANSACTIONS";

  @ApiProperty({
    default: moment().format("YYYY-MM-DD HH:mm:ss"),
  })
  @IsNotEmpty({
    message: "Not allowed, Date time is required!",
  })
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: "Date time must be in the format YYYY-MM-DD HH:mm:ss",
  })
  @IsDateString({ strict: true } as any)
  dateTimeSent: any;

  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, User code is required!"
  })
  userCode: string;
}
