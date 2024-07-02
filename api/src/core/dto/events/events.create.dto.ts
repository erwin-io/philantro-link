import { Transform } from "class-transformer";
import { DefaultEventDto } from "./events-base.dto";
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

export class CreateCharityVolunteerEventDto extends DefaultEventDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(["CHARITY", "VOLUNTEER"])
  @IsUppercase()
  eventType: "CHARITY" | "VOLUNTEER";

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
  dateTime: any;

  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, User code is required!"
  })
  userCode: string;
}

export class CreateDonationEventDto extends DefaultEventDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, User code is required!"
  })
  userCode: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, Transfer Type is required!"
  })
  transferType: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, Transfer Account Number is required!"
  })
  transferAccountNumber: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, Transfer Account Name is required!"
  })
  transferAccountName: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, Donation target amount is required!"
  })
  @IsNumberString({
    message: "Not allowed, Donation target amount should be number!"
  })
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  donationTargetAmount: string;
}

export class CreateAssistanceEventDto extends DefaultEventDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, User code is required!"
  })
  userCode: string;

  @ApiProperty({
    isArray: true,
    type: String
  })
  @IsNotEmpty({
    message: "Not allowed, Assistance Items is required!"
  })
  eventAssistanceItems: string[] = []
}
