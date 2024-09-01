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
  Max,
  Min,
} from "class-validator";
import { UserConversationDto } from "./user-conversation-base.dto";

export class UpdateUserConversationDto extends UserConversationDto {}
