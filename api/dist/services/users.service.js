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
exports.UsersService = void 0;
const utils_1 = require("./../common/utils/utils");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const access_constant_1 = require("../common/constant/access.constant");
const user_error_constant_1 = require("../common/constant/user-error.constant");
const firebase_provider_1 = require("../core/provider/firebase/firebase-provider");
const Access_1 = require("../db/entities/Access");
const Files_1 = require("../db/entities/Files");
const UserProfilePic_1 = require("../db/entities/UserProfilePic");
const Users_1 = require("../db/entities/Users");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
let UsersService = class UsersService {
    constructor(firebaseProvoder, userRepo) {
        this.firebaseProvoder = firebaseProvoder;
        this.userRepo = userRepo;
    }
    async getUserPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.userRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                relations: {
                    access: true,
                    userProfilePic: {
                        file: true,
                    },
                },
                skip,
                take,
                order,
            }),
            this.userRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
            }),
        ]);
        return {
            results: results.map((x) => {
                delete x.password;
                return x;
            }),
            total,
        };
    }
    async getUserById(userId) {
        var _a, _b;
        const res = await this.userRepo.findOne({
            where: {
                userId,
                active: true,
            },
            relations: {
                access: true,
                userProfilePic: {
                    file: true,
                },
            },
        });
        if (!res) {
            throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
        }
        if (res.password)
            delete res.password;
        if (res.access && ((_a = res === null || res === void 0 ? void 0 : res.access) === null || _a === void 0 ? void 0 : _a.accessPages)) {
            res.access.accessPages =
                (res === null || res === void 0 ? void 0 : res.access) && ((_b = res === null || res === void 0 ? void 0 : res.access) === null || _b === void 0 ? void 0 : _b.accessPages)
                    ? res.access.accessPages.map((res) => {
                        if (!res.rights) {
                            res["rights"] = [];
                        }
                        return res;
                    })
                    : [];
        }
        return res;
    }
    async getUserByCode(userCode) {
        var _a, _b;
        const res = await this.userRepo.findOne({
            where: {
                userCode,
                active: true,
            },
            relations: {
                access: true,
                userProfilePic: {
                    file: true,
                },
            },
        });
        if (!res) {
            throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
        }
        if (res.password)
            delete res.password;
        if (res.access && ((_a = res === null || res === void 0 ? void 0 : res.access) === null || _a === void 0 ? void 0 : _a.accessPages)) {
            res.access.accessPages =
                (res === null || res === void 0 ? void 0 : res.access) && ((_b = res === null || res === void 0 ? void 0 : res.access) === null || _b === void 0 ? void 0 : _b.accessPages)
                    ? res.access.accessPages.map((res) => {
                        if (!res.rights) {
                            res["rights"] = [];
                        }
                        return res;
                    })
                    : [];
        }
        return res;
    }
    async create(dto) {
        return await this.userRepo.manager.transaction(async (entityManager) => {
            var _a, _b, _c;
            let user = new Users_1.Users();
            user.userName = dto.mobileNumber;
            user.password = await (0, utils_1.hash)(dto.password);
            user.accessGranted = true;
            user.name = (_a = dto.name) !== null && _a !== void 0 ? _a : "";
            user.mobileNumber = dto.mobileNumber;
            user.userType = dto.userType;
            if (dto.accessCode) {
                const access = await entityManager.findOne(Access_1.Access, {
                    where: {
                        accessId: dto.accessCode,
                        active: true,
                    },
                });
                if (!access) {
                    throw Error(access_constant_1.ACCESS_ERROR_NOT_FOUND);
                }
                user.access = access;
            }
            user = await entityManager.save(Users_1.Users, user);
            user.userCode = (0, utils_1.generateIndentityCode)(user.userId);
            user = await entityManager.save(Users_1.Users, user);
            user = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode: user.userCode,
                    active: true,
                },
                relations: {
                    access: true,
                },
            });
            delete user.password;
            if (user.access && ((_b = user === null || user === void 0 ? void 0 : user.access) === null || _b === void 0 ? void 0 : _b.accessPages)) {
                user.access.accessPages =
                    (user === null || user === void 0 ? void 0 : user.access) && ((_c = user === null || user === void 0 ? void 0 : user.access) === null || _c === void 0 ? void 0 : _c.accessPages)
                        ? user.access.accessPages.map((res) => {
                            if (!res.rights) {
                                res["rights"] = [];
                            }
                            return res;
                        })
                        : [];
            }
            return user;
        });
    }
    async updateProfile(userCode, dto) {
        return await this.userRepo.manager.transaction(async (entityManager) => {
            var _a;
            let user = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode,
                    active: true,
                },
                relations: {
                    access: true,
                },
            });
            if (!user) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            user.name = (_a = dto.name) !== null && _a !== void 0 ? _a : "";
            user.userName = dto.mobileNumber;
            user.mobileNumber = dto.mobileNumber;
            user = await entityManager.save(Users_1.Users, user);
            if (dto.userProfilePic) {
                const newFileName = (0, uuid_1.v4)();
                let userProfilePic = await entityManager.findOne(UserProfilePic_1.UserProfilePic, {
                    where: { userId: user.userId },
                    relations: ["file"],
                });
                const bucket = this.firebaseProvoder.app.storage().bucket();
                if (userProfilePic) {
                    try {
                        const deleteFile = bucket.file(`profile/${userProfilePic.file.fileName}`);
                        deleteFile.delete();
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                    const file = userProfilePic.file;
                    file.fileName = `${newFileName}${(0, path_1.extname)(dto.userProfilePic.fileName)}`;
                    const bucketFile = bucket.file(`profile/${newFileName}${(0, path_1.extname)(dto.userProfilePic.fileName)}`);
                    const img = Buffer.from(dto.userProfilePic.data, "base64");
                    await bucketFile.save(img).then(async (res) => {
                        console.log("res");
                        console.log(res);
                        const url = await bucketFile.getSignedUrl({
                            action: "read",
                            expires: "03-09-2500",
                        });
                        file.url = url[0];
                        userProfilePic.file = await entityManager.save(Files_1.Files, file);
                        user.userProfilePic = await entityManager.save(UserProfilePic_1.UserProfilePic, userProfilePic);
                    });
                }
                else {
                    userProfilePic = new UserProfilePic_1.UserProfilePic();
                    userProfilePic.user = user;
                    const file = new Files_1.Files();
                    file.fileName = `${newFileName}${(0, path_1.extname)(dto.userProfilePic.fileName)}`;
                    const bucketFile = bucket.file(`profile/${newFileName}${(0, path_1.extname)(dto.userProfilePic.fileName)}`);
                    const img = Buffer.from(dto.userProfilePic.data, "base64");
                    await bucketFile.save(img).then(async () => {
                        const url = await bucketFile.getSignedUrl({
                            action: "read",
                            expires: "03-09-2500",
                        });
                        file.url = url[0];
                        userProfilePic.file = await entityManager.save(Files_1.Files, file);
                        user.userProfilePic = await entityManager.save(UserProfilePic_1.UserProfilePic, userProfilePic);
                    });
                }
            }
            user = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode,
                    active: true,
                },
                relations: {
                    access: true,
                    userProfilePic: {
                        file: true,
                    },
                },
            });
            delete user.password;
            return user;
        });
    }
    async updateProfilePicture(userCode, dto) {
        return await this.userRepo.manager.transaction(async (entityManager) => {
            const user = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode,
                },
            });
            if (!user) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            if (dto.userProfilePic) {
                const newFileName = (0, uuid_1.v4)();
                let userProfilePic = await entityManager.findOne(UserProfilePic_1.UserProfilePic, {
                    where: { userId: user.userId },
                    relations: ["file"],
                });
                const bucket = this.firebaseProvoder.app.storage().bucket();
                if (userProfilePic) {
                    try {
                        const deleteFile = bucket.file(`profile/${userProfilePic.file.fileName}`);
                        const exists = await deleteFile.exists();
                        if (exists[0]) {
                            deleteFile.delete();
                        }
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                    const file = userProfilePic.file;
                    file.fileName = `${newFileName}${(0, path_1.extname)(dto.userProfilePic.fileName)}`;
                    const bucketFile = bucket.file(`profile/${newFileName}${(0, path_1.extname)(dto.userProfilePic.fileName)}`);
                    const img = Buffer.from(dto.userProfilePic.data, "base64");
                    await bucketFile.save(img).then(async (res) => {
                        console.log("res");
                        console.log(res);
                        const url = await bucketFile.getSignedUrl({
                            action: "read",
                            expires: "03-09-2500",
                        });
                        file.url = url[0];
                        userProfilePic.file = await entityManager.save(Files_1.Files, file);
                        userProfilePic = await entityManager.save(UserProfilePic_1.UserProfilePic, userProfilePic);
                    });
                }
                else {
                    userProfilePic = new UserProfilePic_1.UserProfilePic();
                    userProfilePic.user = user;
                    const file = new Files_1.Files();
                    file.fileName = `${newFileName}${(0, path_1.extname)(dto.userProfilePic.fileName)}`;
                    const bucketFile = bucket.file(`profile/${newFileName}${(0, path_1.extname)(dto.userProfilePic.fileName)}`);
                    const img = Buffer.from(dto.userProfilePic.data, "base64");
                    await bucketFile.save(img).then(async () => {
                        const url = await bucketFile.getSignedUrl({
                            action: "read",
                            expires: "03-09-2500",
                        });
                        file.url = url[0];
                        userProfilePic.file = await entityManager.save(Files_1.Files, file);
                        userProfilePic = await entityManager.save(UserProfilePic_1.UserProfilePic, userProfilePic);
                    });
                }
            }
            return await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode,
                },
                relations: {
                    userProfilePic: {
                        file: true,
                    },
                    access: true,
                },
            });
        });
    }
    async update(userCode, dto) {
        return await this.userRepo.manager.transaction(async (entityManager) => {
            let user = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode,
                    active: true,
                },
                relations: {
                    access: true,
                },
            });
            if (!user) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            user.name = dto.name;
            user.mobileNumber = dto.mobileNumber;
            user.userName = dto.mobileNumber;
            if (dto.accessCode) {
                const access = await entityManager.findOne(Access_1.Access, {
                    where: {
                        accessId: dto.accessCode,
                        active: true,
                    },
                });
                if (!access) {
                    throw Error(access_constant_1.ACCESS_ERROR_NOT_FOUND);
                }
                user.access = access;
            }
            user = await entityManager.save(Users_1.Users, user);
            user = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode,
                    active: true,
                },
                relations: {
                    access: true,
                },
            });
            delete user.password;
            return user;
        });
    }
    async resetPassword(userCode, dto) {
        return await this.userRepo.manager.transaction(async (entityManager) => {
            let user = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode,
                    active: true,
                },
            });
            if (!user) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            user.password = await (0, utils_1.hash)(dto.password);
            user = await entityManager.save(Users_1.Users, user);
            delete user.password;
            return user;
        });
    }
    async deleteUser(userCode) {
        return await this.userRepo.manager.transaction(async (entityManager) => {
            let user = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode,
                    active: true,
                },
                relations: {
                    access: true,
                },
            });
            if (!user) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            user.active = false;
            user = await entityManager.save(Users_1.Users, user);
            delete user.password;
            return user;
        });
    }
    async approveAccessRequest(userCode) {
        return await this.userRepo.manager.transaction(async (entityManager) => {
            let user = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode,
                    active: true,
                },
                relations: {
                    access: true,
                },
            });
            if (!user) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            user.accessGranted = true;
            user = await entityManager.save(Users_1.Users, user);
            delete user.password;
            return user;
        });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __metadata("design:paramtypes", [firebase_provider_1.FirebaseProvider,
        typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map