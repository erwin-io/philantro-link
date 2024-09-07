import { ProfileResetPasswordDto, UpdateUserPasswordDto } from "src/core/dto/auth/reset-password.dto";
import { MapDto } from "src/core/dto/map/map.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { UpdateProfilePictureDto } from "src/core/dto/user/user-base.dto";
import { CreateAdminUserDto, CreateClientUserDto } from "src/core/dto/user/users.create.dto";
import { UpdateClientUserProfileDto, UpdateClientUserDto, UpdateAdminUserDto, UpdateUserProfileDto } from "src/core/dto/user/users.update.dto";
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
    createClientUser(createUserDto: CreateClientUserDto): Promise<ApiResponseModel<Users>>;
    createAdminUser(createUserDto: CreateAdminUserDto): Promise<ApiResponseModel<Users>>;
    updateAdminProfile(userCode: string, dto: UpdateUserProfileDto): Promise<ApiResponseModel<Users>>;
    updateClientProfile(userCode: string, dto: UpdateClientUserProfileDto): Promise<ApiResponseModel<Users>>;
    updateClientUser(userCode: string, dto: UpdateClientUserDto): Promise<ApiResponseModel<Users>>;
    updateAdminUser(userCode: string, dto: UpdateAdminUserDto): Promise<ApiResponseModel<Users>>;
    profileResetPassword(userCode: string, dto: ProfileResetPasswordDto): Promise<ApiResponseModel<Users>>;
    updateUserPassword(userCode: string, dto: UpdateUserPasswordDto): Promise<ApiResponseModel<Users>>;
    deleteUser(userCode: string): Promise<ApiResponseModel<Users>>;
    approveAccessRequest(userCode: string): Promise<ApiResponseModel<Users>>;
    updateUserLocation(userCode: string, dto: MapDto): Promise<ApiResponseModel<Users>>;
    updateProfilePicture(userCode: string, dto: UpdateProfilePictureDto): Promise<ApiResponseModel<Users>>;
}
