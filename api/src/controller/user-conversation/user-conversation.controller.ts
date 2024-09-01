import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UPDATE_SUCCESS } from "src/common/constant/api-response.constant";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { UserConversation } from "src/db/entities/UserConversation";
import { UserConversationService } from "src/services/user-conversation.service";

@ApiTags("user-conversation")
@Controller("user-conversation")
export class UserConversationController {
  constructor(
    private readonly userConversationService: UserConversationService
  ) {}

  @Get("/:userConversationId")
  //   @UseGuards(JwtAuthGuard)
  async getById(@Param("userConversationId") userConversationId: string) {
    const res: ApiResponseModel<any> = {} as any;
    try {
      res.data = await this.userConversationService.getById(userConversationId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("/getUnreadByUser/:userId")
  //   @UseGuards(JwtAuthGuard)
  async getUnreadByUser(@Param("userId") userId: string) {
    const res: ApiResponseModel<any> = {} as any;
    try {
      res.data = await this.userConversationService.getUnreadByUser(userId);
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
  async getPaginated(@Body() params: PaginationParamsDto) {
    const res: ApiResponseModel<{
      results: UserConversation[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.userConversationService.getPagination(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/marAsRead/:userConversationId/")
  //   @UseGuards(JwtAuthGuard)
  async updateStatus(@Param("userConversationId") userConversationId: string) {
    const res: ApiResponseModel<UserConversation> = {} as any;
    try {
      res.data = await this.userConversationService.markAsRead(
        userConversationId
      );
      res.success = true;
      res.message = `User Conversation ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
