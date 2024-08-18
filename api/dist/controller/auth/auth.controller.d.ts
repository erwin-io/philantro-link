import { AuthService } from "../../services/auth.service";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { LogInDto } from "src/core/dto/auth/login.dto";
import { Users } from "src/db/entities/Users";
import { RegisterClientUserDto } from "src/core/dto/auth/register.dto";
import { VerifyClientUserDto } from "src/core/dto/auth/verify.dto";
import { ResetPasswordDto, ResetPasswordSubmitDto, ResetVerifyDto } from "src/core/dto/auth/reset-password.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerClient(createUserDto: RegisterClientUserDto): Promise<ApiResponseModel<Users>>;
    registerVerify(dto: VerifyClientUserDto): Promise<ApiResponseModel<Users>>;
    loginAdmin(loginUserDto: LogInDto): Promise<ApiResponseModel<Users>>;
    loginClient(loginUserDto: LogInDto): Promise<ApiResponseModel<Users>>;
    resetPassword(dto: ResetPasswordDto): Promise<ApiResponseModel<Users>>;
    resetSubmit(dto: ResetPasswordSubmitDto): Promise<ApiResponseModel<boolean>>;
    resetVerify(dto: ResetVerifyDto): Promise<ApiResponseModel<boolean>>;
}
