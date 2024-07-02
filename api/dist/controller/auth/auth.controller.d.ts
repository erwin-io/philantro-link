import { AuthService } from "../../services/auth.service";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { LogInDto } from "src/core/dto/auth/login.dto";
import { Users } from "src/db/entities/Users";
import { RegisterClientUserDto } from "src/core/dto/auth/register.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerClient(createUserDto: RegisterClientUserDto): Promise<ApiResponseModel<Users>>;
    loginAdmin(loginUserDto: LogInDto): Promise<ApiResponseModel<Users>>;
    loginClient(loginUserDto: LogInDto): Promise<ApiResponseModel<Users>>;
}
