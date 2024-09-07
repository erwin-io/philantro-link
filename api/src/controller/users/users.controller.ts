import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from "@nestjs/common";
import { ApiTags, ApiParam } from "@nestjs/swagger";
import {
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
  DELETE_SUCCESS,
} from "src/common/constant/api-response.constant";
import {
  ProfileResetPasswordDto,
  UpdateUserPasswordDto,
} from "src/core/dto/auth/reset-password.dto";
import { MapDto } from "src/core/dto/map/map.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { UpdateProfilePictureDto } from "src/core/dto/user/user-base.dto";
import {
  CreateAdminUserDto,
  CreateClientUserDto,
} from "src/core/dto/user/users.create.dto";
import {
  UpdateClientUserProfileDto,
  UpdateClientUserDto,
  UpdateAdminUserDto,
  UpdateUserProfileDto,
} from "src/core/dto/user/users.update.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Users } from "src/db/entities/Users";
import { UsersService } from "src/services/users.service";

@ApiTags("users")
@Controller("users")
// @ApiBearerAuth("jwt")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get("/:userCode/details")
  //   @UseGuards(JwtAuthGuard)
  async getUserDetailsDetails(@Param("userCode") userCode: string) {
    const res = {} as ApiResponseModel<Users>;
    try {
      res.data = await this.userService.getUserByCode(userCode);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/page")
  //   @UseGuards(JwtAuthGuard)
  async getUserPagination(@Body() paginationParams: PaginationParamsDto) {
    const res: ApiResponseModel<{ results: Users[]; total: number }> =
      {} as any;
    try {
      res.data = await this.userService.getUserPagination(paginationParams);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/createClientUser")
  //   @UseGuards(JwtAuthGuard)
  async createClientUser(@Body() createUserDto: CreateClientUserDto) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.userService.createClientUser(createUserDto);
      res.success = true;
      res.message = `User  ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/createAdminUser")
  //   @UseGuards(JwtAuthGuard)
  async createAdminUser(@Body() createUserDto: CreateAdminUserDto) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.userService.createAdminUser(createUserDto);
      res.success = true;
      res.message = `User  ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateAdminProfile/:userCode")
  //   @UseGuards(JwtAuthGuard)
  async updateAdminProfile(
    @Param("userCode") userCode: string,
    @Body() dto: UpdateUserProfileDto
  ) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.userService.updateAdminProfile(userCode, dto);
      res.success = true;
      res.message = `User ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateClientProfile/:userCode")
  //   @UseGuards(JwtAuthGuard)
  async updateClientProfile(
    @Param("userCode") userCode: string,
    @Body() dto: UpdateClientUserProfileDto
  ) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.userService.updateClientProfile(userCode, dto);
      res.success = true;
      res.message = `User ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateClientUser/:userCode")
  //   @UseGuards(JwtAuthGuard)
  async updateClientUser(
    @Param("userCode") userCode: string,
    @Body() dto: UpdateClientUserDto
  ) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.userService.updateClientUser(userCode, dto);
      res.success = true;
      res.message = `User ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateAdminUser/:userCode")
  //   @UseGuards(JwtAuthGuard)
  async updateAdminUser(
    @Param("userCode") userCode: string,
    @Body() dto: UpdateAdminUserDto
  ) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.userService.updateAdminUser(userCode, dto);
      res.success = true;
      res.message = `User ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/profileResetPassword/:userCode")
  //   @UseGuards(JwtAuthGuard)
  async profileResetPassword(
    @Param("userCode") userCode: string,
    @Body() dto: ProfileResetPasswordDto
  ) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.userService.profileResetPassword(userCode, dto);
      res.success = true;
      res.message = `User password ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateUserPassword/:userCode")
  //   @UseGuards(JwtAuthGuard)
  async updateUserPassword(
    @Param("userCode") userCode: string,
    @Body() dto: UpdateUserPasswordDto
  ) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.userService.updateUserPassword(userCode, dto);
      res.success = true;
      res.message = `User password ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:userCode")
  //   @UseGuards(JwtAuthGuard)
  async deleteUser(@Param("userCode") userCode: string) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.userService.deleteUser(userCode);
      res.success = true;
      res.message = `User ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:userCode/approveAccessRequest")
  //   @UseGuards(JwtAuthGuard)
  async approveAccessRequest(@Param("userCode") userCode: string) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.userService.approveAccessRequest(userCode);
      res.success = true;
      res.message = `User access request ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateUserLocation/:userCode")
  //   @UseGuards(JwtAuthGuard)
  async updateUserLocation(
    @Param("userCode") userCode: string,
    @Body() dto: MapDto
  ) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.userService.updateUserLocation(userCode, dto);
      res.success = true;
      res.message = `User access request ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateProfilePicture/:userCode")
  async updateProfilePicture(
    @Param("userCode") userCode: string,
    @Body() dto: UpdateProfilePictureDto
  ) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.userService.updateProfilePicture(userCode, dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
