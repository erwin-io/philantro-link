import { LocalAuthGuard } from "../../core/auth/local.auth.guard";
import {
  Controller,
  Body,
  Post,
  Get,
  Req,
  UseGuards,
  Param,
  Headers,
  Query,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "../../services/auth.service";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { LogInDto } from "src/core/dto/auth/login.dto";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { IsIn } from "class-validator";
import {
  REGISTER_SUCCESS,
  VERIFICATION_SUCCESS,
} from "src/common/constant/api-response.constant";
import { Users } from "src/db/entities/Users";
import { RegisterClientUserDto } from "src/core/dto/auth/register.dto";
import { VerifyClientUserDto } from "src/core/dto/auth/verify.dto";
import {
  ResetPasswordDto,
  ResetPasswordSubmitDto,
  ResetVerifyDto,
} from "src/core/dto/auth/reset-password.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register/client")
  public async registerClient(@Body() createUserDto: RegisterClientUserDto) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.authService.registerClient(createUserDto);
      res.success = true;
      res.message = `${REGISTER_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("register/verify")
  public async registerVerify(@Body() dto: VerifyClientUserDto) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.authService.registerVerify(dto);
      res.success = true;
      res.message = `${VERIFICATION_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("login/admin")
  public async loginAdmin(@Body() loginUserDto: LogInDto) {
    const res: ApiResponseModel<Users> = {} as ApiResponseModel<Users>;
    try {
      res.data = await this.authService.getAdminByCredentials(loginUserDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("login/client")
  public async loginClient(@Body() loginUserDto: LogInDto) {
    const res: ApiResponseModel<Users> = {} as ApiResponseModel<Users>;
    try {
      res.data = await this.authService.getClientByCredentials(loginUserDto);
      res.success = true;
      return res;
    } catch (e) {
      throw new HttpException(
        e.message !== undefined ? e.message : e,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post("reset")
  public async resetPassword(@Body() dto: ResetPasswordDto) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.authService.resetPassword(dto);
      res.success = true;
      res.message = `${VERIFICATION_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("reset/submit")
  public async resetSubmit(@Body() dto: ResetPasswordSubmitDto) {
    const res: ApiResponseModel<boolean> = {} as any;
    try {
      res.data = await this.authService.resetPasswordSubmit(dto);
      res.success = true;
      res.message = `Reset password email verification sent!`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("reset/verify")
  public async resetVerify(@Body() dto: ResetVerifyDto) {
    const res: ApiResponseModel<boolean> = {} as any;
    try {
      res.data = await this.authService.resetPasswordVerify(dto);
      res.success = true;
      res.message = `${VERIFICATION_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
