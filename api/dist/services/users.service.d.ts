import { UpdateUserResetPasswordDto } from "src/core/dto/auth/reset-password.dto";
import { UpdateProfilePictureDto } from "src/core/dto/user/user-base.dto";
import { CreateUserDto } from "src/core/dto/user/users.create.dto";
import { UpdateUserDto, UpdateUserProfileDto } from "src/core/dto/user/users.update.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Users } from "src/db/entities/Users";
import { Repository } from "typeorm";
export declare class UsersService {
    private firebaseProvoder;
    private readonly userRepo;
    constructor(firebaseProvoder: FirebaseProvider, userRepo: Repository<Users>);
    getUserPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: Users[];
        total: number;
    }>;
    getUserById(userId: any): Promise<Users>;
    getUserByCode(userCode: any): Promise<Users>;
    create(dto: CreateUserDto): Promise<Users>;
    updateProfile(userCode: any, dto: UpdateUserProfileDto): Promise<Users>;
    updateProfilePicture(userCode: any, dto: UpdateProfilePictureDto): Promise<Users>;
    update(userCode: any, dto: UpdateUserDto): Promise<Users>;
    resetPassword(userCode: any, dto: UpdateUserResetPasswordDto): Promise<Users>;
    deleteUser(userCode: any): Promise<Users>;
    approveAccessRequest(userCode: any): Promise<Users>;
}
