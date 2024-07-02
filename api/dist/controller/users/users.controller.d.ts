import { UpdateUserResetPasswordDto } from "src/core/dto/auth/reset-password.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { UpdateProfilePictureDto } from "src/core/dto/user/user-base.dto";
import { CreateUserDto } from "src/core/dto/user/users.create.dto";
import { UpdateUserDto, UpdateUserProfileDto } from "src/core/dto/user/users.update.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Users } from "src/db/entities/Users";
import { UsersService } from "src/services/users.service";
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getUserDetailsDetails(userCode: string): Promise<ApiResponseModel<Users>>;
    getUserPagination(paginationParams: PaginationParamsDto): Promise<ApiResponseModel<{
        results: Users[];
        total: number;
    }>>;
    create(createUserDto: CreateUserDto): Promise<ApiResponseModel<Users>>;
    updateProfile(userCode: string, updateUserProfileDto: UpdateUserProfileDto): Promise<ApiResponseModel<Users>>;
    update(userCode: string, updateUserDto: UpdateUserDto): Promise<ApiResponseModel<Users>>;
    resetPassword(userCode: string, updateUserResetPasswordDto: UpdateUserResetPasswordDto): Promise<ApiResponseModel<Users>>;
    deleteUser(userCode: string): Promise<ApiResponseModel<Users>>;
    approveAccessRequest(userCode: string): Promise<ApiResponseModel<Users>>;
    updateProfilePicture(userCode: string, dto: UpdateProfilePictureDto): Promise<ApiResponseModel<Users>>;
}
