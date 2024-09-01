"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const utils_1 = require("../common/utils/utils");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Users_1 = require("../db/entities/Users");
const auth_error_constant_1 = require("../common/constant/auth-error.constant");
const user_type_constant_1 = require("../common/constant/user-type.constant");
const notifications_service_1 = require("./notifications.service");
const email_service_1 = require("./email.service");
const user_conversation_service_1 = require("./user-conversation.service");
let AuthService = class AuthService {
    constructor(userRepo, jwtService, notificationService, userConversationService, emailService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.notificationService = notificationService;
        this.userConversationService = userConversationService;
        this.emailService = emailService;
    }
    async registerClient(dto) {
        try {
            return await this.userRepo.manager.transaction(async (transactionalEntityManager) => {
                let user = await transactionalEntityManager.findOneBy(Users_1.Users, {
                    email: dto.email
                });
                if (!user) {
                    user = new Users_1.Users();
                }
                else if (user && user.isVerifiedUser) {
                    throw Error("Email already used!");
                }
                user.userName = dto.email;
                user.password = await (0, utils_1.hash)(dto.password);
                user.accessGranted = true;
                user.name = dto.name;
                user.email = dto.email;
                user.helpNotifPreferences = dto.helpNotifPreferences;
                user.userType = user_type_constant_1.USER_TYPE.CLIENT.toUpperCase();
                user.currentOtp = (0, utils_1.generateOTP)();
                user = await transactionalEntityManager.save(user);
                const sendEmailResult = await this.emailService.sendEmailVerification(dto.email, user.userCode, user.currentOtp);
                if (!sendEmailResult) {
                    throw new Error("Error sending email verification!");
                }
                user.userCode = (0, utils_1.generateIndentityCode)(user.userId);
                user = await transactionalEntityManager.save(Users_1.Users, user);
                delete user.password;
                return user;
            });
        }
        catch (ex) {
            if (ex["message"] &&
                (ex["message"].includes("duplicate key") ||
                    ex["message"].includes("violates unique constraint")) &&
                ex["message"].includes("u_username")) {
                throw Error("Email already used!");
            }
            else {
                throw ex;
            }
        }
    }
    async registerVerify(dto) {
        try {
            return await this.userRepo.manager.transaction(async (transactionalEntityManager) => {
                let user = await transactionalEntityManager.findOneBy(Users_1.Users, {
                    email: dto.email,
                });
                if (!user) {
                    throw Error("Email not found!");
                }
                else if (user && user.isVerifiedUser) {
                    throw Error("Email already verified!");
                }
                else if (user && user.currentOtp.toString().trim() !== dto.otp.toString().trim()) {
                    throw Error("Invalid code!");
                }
                user.isVerifiedUser = true;
                user = await transactionalEntityManager.save(Users_1.Users, user);
                delete user.password;
                return user;
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    async getByCredentials({ userName, password }) {
        try {
            let user = await this.userRepo.findOne({
                where: {
                    userName,
                    active: true,
                },
                relations: {
                    access: true,
                    userProfilePic: {
                        file: true,
                    },
                }
            });
            if (!user) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_USER_NOT_FOUND);
            }
            const passwordMatch = await (0, utils_1.compare)(user.password, password);
            if (!passwordMatch) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PASSWORD_INCORRECT);
            }
            if (!user.accessGranted) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PENDING_ACCESS_REQUEST);
            }
            delete user.password;
            return user;
        }
        catch (ex) {
            throw ex;
        }
    }
    async getAdminByCredentials({ userName, password }) {
        try {
            let user = await this.userRepo.findOne({
                where: {
                    userName,
                    active: true,
                    userType: (0, typeorm_2.In)([user_type_constant_1.USER_TYPE.ADMIN.toUpperCase()])
                },
                relations: {
                    access: true,
                    userProfilePic: {
                        file: true,
                    },
                }
            });
            if (!user) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_USER_NOT_FOUND);
            }
            const passwordMatch = await (0, utils_1.compare)(user.password, password);
            if (!passwordMatch) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PASSWORD_INCORRECT);
            }
            if (!user.accessGranted) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PENDING_ACCESS_REQUEST);
            }
            delete user.password;
            const unReadNotif = await this.notificationService.getUnreadByUser(user.userId);
            const unReadMessage = await this.userConversationService.getUnreadByUser(user.userId);
            const totalUnreadNotif = Number(unReadNotif) + Number(unReadMessage);
            return Object.assign(Object.assign({}, user), { totalUnreadNotif });
        }
        catch (ex) {
            throw ex;
        }
    }
    async getClientByCredentials({ userName, password }) {
        try {
            let user = await this.userRepo.findOne({
                where: {
                    userName,
                    active: true,
                    userType: user_type_constant_1.USER_TYPE.CLIENT.toUpperCase()
                },
                relations: {
                    userProfilePic: {
                        file: true,
                    },
                }
            });
            if (!user) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_USER_NOT_FOUND);
            }
            const passwordMatch = await (0, utils_1.compare)(user.password, password);
            if (!passwordMatch) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PASSWORD_INCORRECT);
            }
            if (!user.accessGranted) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PENDING_ACCESS_REQUEST);
            }
            delete user.password;
            const unReadNotif = await this.notificationService.getUnreadByUser(user.userId);
            const unReadMessage = await this.userConversationService.getUnreadByUser(user.userId);
            const totalUnreadNotif = Number(unReadNotif) + Number(unReadMessage);
            return Object.assign(Object.assign({}, user), { totalUnreadNotif });
        }
        catch (ex) {
            throw ex;
        }
    }
    async verifyUser(userCode, hash) {
        try {
            return await this.userRepo.manager.transaction(async (entityManager) => {
                let user = await entityManager.findOne(Users_1.Users, {
                    where: {
                        userCode
                    }
                });
                if (!user) {
                    throw Error("Invalid user code");
                }
                if (user.isVerifiedUser) {
                    throw Error("User was already verified!");
                }
                const match = await (0, utils_1.compare)(hash, user.currentOtp);
                if (!match) {
                    throw Error("Invalid code");
                }
                user.isVerifiedUser = true;
                user = await entityManager.save(Users_1.Users, user);
                delete user.password;
                return true;
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    async resetPasswordSubmit(dto) {
        try {
            return await this.userRepo.manager.transaction(async (entityManager) => {
                let user = await entityManager.findOne(Users_1.Users, {
                    where: {
                        email: dto.email
                    }
                });
                if (!user) {
                    throw Error("Email not found!");
                }
                if (!user.isVerifiedUser) {
                    throw Error("User was not yet verified!");
                }
                user.currentOtp = (0, utils_1.generateOTP)();
                user = await entityManager.save(Users_1.Users, user);
                const sendEmailResult = await this.emailService.sendResetPasswordOtp(dto.email, user.userCode, user.currentOtp);
                if (!sendEmailResult) {
                    throw new Error("Error sending email verification!");
                }
                delete user.password;
                return true;
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    async resetPasswordVerify(dto) {
        try {
            return await this.userRepo.manager.transaction(async (entityManager) => {
                let user = await entityManager.findOne(Users_1.Users, {
                    where: {
                        email: dto.email
                    }
                });
                if (!user) {
                    throw Error("Email not found!");
                }
                if (!user.isVerifiedUser) {
                    throw Error("User was not yet verified!");
                }
                const match = user.currentOtp === dto.otp;
                if (!match) {
                    throw Error("Invalid code");
                }
                return true;
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    async resetPassword(dto) {
        try {
            return await this.userRepo.manager.transaction(async (entityManager) => {
                let user = await entityManager.findOne(Users_1.Users, {
                    where: {
                        email: dto.email
                    }
                });
                if (!user) {
                    throw Error("Email not found!");
                }
                if (!user.isVerifiedUser) {
                    throw Error("User was not yet verified!");
                }
                const match = user.currentOtp === dto.otp;
                if (!match) {
                    throw Error("Invalid code");
                }
                user.password = await (0, utils_1.hash)(dto.password);
                user = await entityManager.save(Users_1.Users, user);
                delete user.password;
                return user;
            });
        }
        catch (ex) {
            throw ex;
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        notifications_service_1.NotificationsService,
        user_conversation_service_1.UserConversationService,
        email_service_1.EmailService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map