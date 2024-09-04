import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsIn,
  IsUppercase,
  IsDateString,
  Matches,
  IsNumberString,
} from "class-validator";
import { DefaultEventDto } from "./events-base.dto";
import moment from "moment";
import { Transform } from "class-transformer";

export class UpdateCharityVolunteerEventDto extends DefaultEventDto {
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
}

export class UpdateDonationEventDto extends DefaultEventDto {
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

export class UpdateAssistanceEventDto extends DefaultEventDto {
  @ApiProperty({
    isArray: true,
    type: String
  })
  @IsNotEmpty({
    message: "Not allowed, Assistance Items is required!"
  })
  eventAssistanceItems: string[] = []
}

export class UpdateEventInterestedDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, User code is required!",
  })
  userCode: string;
}

export class UpdateEventRespondedDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, User code is required!",
  })
  userCode: string;
}

export class UpdateEventStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(["APPROVED", "REJECTED", "COMPLETED", "INPROGRESS", "CANCELLED"])
  @IsUppercase()
  status: "APPROVED" | "REJECTED" | "COMPLETED" | "INPROGRESS" | "CANCELLED";
}
