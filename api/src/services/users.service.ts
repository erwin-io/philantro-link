import {
  columnDefToTypeORMCondition,
  compare,
  generateIndentityCode,
  getFullName,
  hash,
} from "./../common/utils/utils";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { extname } from "path";
import { ACCESS_ERROR_NOT_FOUND } from "src/common/constant/access.constant";
import { LOGIN_ERROR_PASSWORD_INCORRECT } from "src/common/constant/auth-error.constant";
import { USER_ERROR_USER_NOT_FOUND } from "src/common/constant/user-error.constant";
import { USER_TYPE } from "src/common/constant/user-type.constant";
import {
  ProfileResetPasswordDto,
  UpdateUserPasswordDto,
} from "src/core/dto/auth/reset-password.dto";
import { MapDto } from "src/core/dto/map/map.dto";
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
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Access } from "src/db/entities/Access";
import { Files } from "src/db/entities/Files";
import { Notifications } from "src/db/entities/Notifications";
import { UserConversation } from "src/db/entities/UserConversation";
import { UserProfilePic } from "src/db/entities/UserProfilePic";
import { Users } from "src/db/entities/Users";
import { In, Repository } from "typeorm";
import { v4 as uuid } from "uuid";

@Injectable()
export class UsersService {
  constructor(
    private firebaseProvoder: FirebaseProvider,
    @InjectRepository(Users) private readonly userRepo: Repository<Users>
  ) {}

  async getUserPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);
    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.userRepo.find({
        where: {
          ...condition,
          active: true,
        },
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
        where: {
          ...condition,
          active: true,
        },
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
      throw Error(USER_ERROR_USER_NOT_FOUND);
    }
    if (res.password) delete res.password;
    if (res.access && res?.access?.accessPages) {
      res.access.accessPages =
        res?.access && res?.access?.accessPages
          ? (
              res.access.accessPages as {
                page: string;
                view: boolean;
                modify: boolean;
                rights: string[];
              }[]
            ).map((res) => {
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
      throw Error(USER_ERROR_USER_NOT_FOUND);
    }
    if (res.password) delete res.password;
    if (res.access && res?.access?.accessPages) {
      res.access.accessPages =
        res?.access && res?.access?.accessPages
          ? (
              res.access.accessPages as {
                page: string;
                view: boolean;
                modify: boolean;
                rights: string[];
              }[]
            ).map((res) => {
              if (!res.rights) {
                res["rights"] = [];
              }
              return res;
            })
          : [];
    }
    return res;
  }

  async createClientUser(dto: CreateClientUserDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = new Users();
      user.userName = dto.email;
      user.password = await hash(dto.password);
      user.accessGranted = true;

      user.name = dto.name ?? "";
      user.email = dto.email;
      user.currentOtp = "0";
      user.isVerifiedUser = true;
      user.userType = USER_TYPE.CLIENT;
      user = await entityManager.save(Users, user);
      user.userCode = generateIndentityCode(user.userId);
      user = await entityManager.save(Users, user);
      user = await entityManager.findOne(Users, {
        where: {
          userCode: user.userCode,
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

  async createAdminUser(dto: CreateAdminUserDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = new Users();
      user.userName = dto.email;
      user.password = await hash(dto.password);
      user.accessGranted = true;

      user.name = dto.name ?? "";
      user.email = dto.email;
      user.userType = USER_TYPE.ADMIN;
      if (dto.accessCode) {
        const access = await entityManager.findOne(Access, {
          where: {
            accessId: dto.accessCode,
            active: true,
          },
        });

        if (!access) {
          throw Error(ACCESS_ERROR_NOT_FOUND);
        }
        user.access = access;
      }
      user = await entityManager.save(Users, user);
      user.userCode = generateIndentityCode(user.userId);
      user = await entityManager.save(Users, user);
      user = await entityManager.findOne(Users, {
        where: {
          userCode: user.userCode,
          active: true,
        },
        relations: {
          access: true,
        },
      });
      delete user.password;
      if (user.access && user?.access?.accessPages) {
        user.access.accessPages =
          user?.access && user?.access?.accessPages
            ? (
                user.access.accessPages as {
                  page: string;
                  view: boolean;
                  modify: boolean;
                  rights: string[];
                }[]
              ).map((res) => {
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

  async updateAdminProfile(userCode, dto: UpdateUserProfileDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        where: {
          userCode,
          active: true,
        },
        relations: {
          access: true,
        },
      });

      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }

      user.name = dto.name ?? "";
      user.userName = dto.email;
      user.email = dto.email;
      user = await entityManager.save(Users, user);

      if (dto.userProfilePic) {
        const newGUID: string = uuid();
        let userProfilePic = await entityManager.findOne(UserProfilePic, {
          where: { userId: user.userId },
          relations: ["file"],
        });
        const bucket = this.firebaseProvoder.app.storage().bucket();
        if (userProfilePic) {
          try {
            const deleteFile = bucket.file(
              `profile/${userProfilePic.file.fileName}`
            );
            deleteFile.delete();
          } catch (ex) {
            console.log(ex);
          }
          const file = userProfilePic.file;
          file.fileName = dto.userProfilePic.fileName;

          const bucketFile = bucket.file(
            `profile/${newGUID}${extname(dto.userProfilePic.fileName)}`
          );
          const img = Buffer.from(dto.userProfilePic.data, "base64");
          await bucketFile.save(img).then(async (res) => {
            console.log("res");
            console.log(res);
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });

            file.url = url[0];
            file.fileName = dto.userProfilePic.fileName;
            file.guid = newGUID;
            userProfilePic.file = await entityManager.save(Files, file);
            user.userProfilePic = await entityManager.save(
              UserProfilePic,
              userProfilePic
            );
          });
        } else {
          userProfilePic = new UserProfilePic();
          userProfilePic.user = user;
          const file = new Files();
          file.fileName = dto.userProfilePic.fileName;
          const bucketFile = bucket.file(
            `profile/${newGUID}${extname(dto.userProfilePic.fileName)}`
          );
          const img = Buffer.from(dto.userProfilePic.data, "base64");
          await bucketFile.save(img).then(async () => {
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });
            file.url = url[0];
            file.fileName = dto.userProfilePic.fileName;
            file.guid = newGUID;
            userProfilePic.file = await entityManager.save(Files, file);
            user.userProfilePic = await entityManager.save(
              UserProfilePic,
              userProfilePic
            );
          });
        }
      }
      user = await entityManager.findOne(Users, {
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

  async updateClientProfile(userCode, dto: UpdateClientUserProfileDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        where: {
          userCode,
          active: true,
        },
        relations: {
          access: true,
        },
      });

      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }

      user.name = dto.name ?? "";
      user.userName = dto.email;
      user.email = dto.email;
      user.helpNotifPreferences = dto.helpNotifPreferences;
      user = await entityManager.save(Users, user);

      if (dto.userProfilePic) {
        const newFileName: string = uuid();
        let userProfilePic = await entityManager.findOne(UserProfilePic, {
          where: { userId: user.userId },
          relations: ["file"],
        });
        const bucket = this.firebaseProvoder.app.storage().bucket();
        if (userProfilePic) {
          try {
            const deleteFile = bucket.file(
              `profile/${userProfilePic.file.fileName}`
            );
            deleteFile.delete();
          } catch (ex) {
            console.log(ex);
          }
          const file = userProfilePic.file;
          file.fileName = `${newFileName}${extname(
            dto.userProfilePic.fileName
          )}`;

          const bucketFile = bucket.file(
            `profile/${newFileName}${extname(dto.userProfilePic.fileName)}`
          );
          const img = Buffer.from(dto.userProfilePic.data, "base64");
          await bucketFile.save(img).then(async (res) => {
            console.log("res");
            console.log(res);
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });

            file.url = url[0];
            userProfilePic.file = await entityManager.save(Files, file);
            user.userProfilePic = await entityManager.save(
              UserProfilePic,
              userProfilePic
            );
          });
        } else {
          userProfilePic = new UserProfilePic();
          userProfilePic.user = user;
          const file = new Files();
          file.fileName = `${newFileName}${extname(
            dto.userProfilePic.fileName
          )}`;
          const bucketFile = bucket.file(
            `profile/${newFileName}${extname(dto.userProfilePic.fileName)}`
          );
          const img = Buffer.from(dto.userProfilePic.data, "base64");
          await bucketFile.save(img).then(async () => {
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });
            file.url = url[0];
            userProfilePic.file = await entityManager.save(Files, file);
            user.userProfilePic = await entityManager.save(
              UserProfilePic,
              userProfilePic
            );
          });
        }
      }
      user = await entityManager.findOne(Users, {
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
      const unReadNotif = await entityManager.count(Notifications, {
        where: {
          user: {
            userId: user.userId,
            active: true,
          },
          isRead: false,
        },
      });
      const unReadMessage = await entityManager.count(UserConversation, {
        where: {
          fromUser: {
            userId: user.userId,
            active: true,
          },
          active: true,
          status: In(["SENT", "DELIVERED"]),
        },
      });
      const totalUnreadNotif = Number(unReadNotif) + Number(unReadMessage);
      delete user.password;
      return {
        ...user,
        totalUnreadNotif,
      };
    });
  }

  async updateProfilePicture(userCode, dto: UpdateProfilePictureDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      const user: any = await entityManager.findOne(Users, {
        where: {
          userCode,
        },
      });
      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }
      if (dto.userProfilePic) {
        const newGUID: string = uuid();
        let userProfilePic = await entityManager.findOne(UserProfilePic, {
          where: { userId: user.userId },
          relations: ["file"],
        });
        const bucket = this.firebaseProvoder.app.storage().bucket();
        if (userProfilePic) {
          try {
            const deleteFile = bucket.file(
              `profile/${userProfilePic.file.fileName}`
            );
            const exists = await deleteFile.exists();
            if (exists[0]) {
              deleteFile.delete();
            }
          } catch (ex) {
            console.log(ex);
          }
          const file = userProfilePic.file;
          file.fileName = dto.userProfilePic.fileName;
          file.guid = newGUID;

          const bucketFile = bucket.file(
            `profile/${newGUID}${extname(dto.userProfilePic.fileName)}`
          );
          const img = Buffer.from(dto.userProfilePic.data, "base64");
          await bucketFile.save(img).then(async (res) => {
            console.log("res");
            console.log(res);
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });

            file.url = url[0];
            userProfilePic.file = await entityManager.save(Files, file);
            userProfilePic = await entityManager.save(
              UserProfilePic,
              userProfilePic
            );
          });
        } else {
          userProfilePic = new UserProfilePic();
          userProfilePic.user = user;
          const file = new Files();
          file.fileName = dto.userProfilePic.fileName;
          file.guid = newGUID;
          const bucketFile = bucket.file(
            `profile/${newGUID}${extname(dto.userProfilePic.fileName)}`
          );
          const img = Buffer.from(dto.userProfilePic.data, "base64");
          await bucketFile.save(img).then(async () => {
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });
            file.url = url[0];
            userProfilePic.file = await entityManager.save(Files, file);
            userProfilePic = await entityManager.save(
              UserProfilePic,
              userProfilePic
            );
          });
        }
      }
      return await entityManager.findOne(Users, {
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

  async updateClientUser(userCode, dto: UpdateClientUserDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        where: {
          userCode,
          active: true,
        },
        relations: {
          access: true,
        },
      });

      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }

      user.name = dto.name;
      user.email = dto.email;
      user.userName = dto.email;
      user = await entityManager.save(Users, user);
      user = await entityManager.findOne(Users, {
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

  async updateAdminUser(userCode, dto: UpdateAdminUserDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        where: {
          userCode,
          active: true,
        },
        relations: {
          access: true,
        },
      });

      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }

      user.name = dto.name;
      user.email = dto.email;
      user.userName = dto.email;
      if (dto.accessCode) {
        const access = await entityManager.findOne(Access, {
          where: {
            accessId: dto.accessCode,
            active: true,
          },
        });

        if (!access) {
          throw Error(ACCESS_ERROR_NOT_FOUND);
        }
        user.access = access;
      }
      user = await entityManager.save(Users, user);
      user = await entityManager.findOne(Users, {
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

  async profileResetPassword(userCode, dto: ProfileResetPasswordDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        where: {
          userCode,
          active: true,
        },
      });

      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }
      const passwordMatch = await compare(user.password, dto.password);
      if (!passwordMatch) {
        throw Error(LOGIN_ERROR_PASSWORD_INCORRECT);
      }

      user.password = await hash(dto.password);
      user = await entityManager.save(Users, user);
      delete user.password;
      return user;
    });
  }

  async updateUserPassword(userCode, dto: UpdateUserPasswordDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        where: {
          userCode,
          active: true,
        },
      });

      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }

      user.password = await hash(dto.password);
      user = await entityManager.save(Users, user);
      delete user.password;
      return user;
    });
  }

  async deleteUser(userCode) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        where: {
          userCode,
          active: true,
        },
        relations: {
          access: true,
        },
      });

      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }

      user.active = false;
      user = await entityManager.save(Users, user);
      delete user.password;
      return user;
    });
  }

  async approveAccessRequest(userCode) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        where: {
          userCode,
          active: true,
        },
        relations: {
          access: true,
        },
      });

      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }

      user.accessGranted = true;
      user = await entityManager.save(Users, user);
      delete user.password;
      return user;
    });
  }

  async updateUserLocation(userCode, dto: MapDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        where: {
          userCode,
          active: true,
        },
      });

      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }

      user.currentLocation = dto;
      user = await entityManager.save(Users, user);
      delete user.password;
      return user;
    });
  }
}
