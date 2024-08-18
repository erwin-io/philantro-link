
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { JwtPayload } from "../core/interfaces/payload.interface";
import { JwtService } from "@nestjs/jwt";
import * as fs from "fs";
import * as path from "path";
import {
  compare,
  generateIndentityCode,
  generateOTP,
  getFullName,
  hash,
} from "src/common/utils/utils";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, In, Repository } from "typeorm";
import moment from "moment";
import { Users } from "src/db/entities/Users";
import { LOGIN_ERROR_PASSWORD_INCORRECT, LOGIN_ERROR_PENDING_ACCESS_REQUEST, LOGIN_ERROR_USER_NOT_FOUND } from "src/common/constant/auth-error.constant";
import { USER_TYPE } from "src/common/constant/user-type.constant";
import { NotificationsService } from "./notifications.service";
import { RegisterClientUserDto } from "src/core/dto/auth/register.dto";
import { ConfigService } from "@nestjs/config";
import { VerifyClientUserDto } from "src/core/dto/auth/verify.dto";
import { EmailService } from "./email.service";
import { ResetPasswordDto, ResetPasswordSubmitDto, ResetVerifyDto } from "src/core/dto/auth/reset-password.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepo: Repository<Users>,
    private readonly jwtService: JwtService,
    private notificationService: NotificationsService,
    private emailService: EmailService
  ) {}

  async registerClient(dto: RegisterClientUserDto) {
    try {
      return await this.userRepo.manager.transaction(
        async (transactionalEntityManager) => {
          let user = await transactionalEntityManager.findOneBy(Users, {
            email: dto.email
          });

          if(!user) {
            user = new Users();
          }
          else if(user && user.isVerifiedUser) {
            throw Error("Email already used!");
          }
          user.userName = dto.email;
          user.password = await hash(dto.password);
          user.accessGranted = true;
          user.name = dto.name;
          user.email = dto.email;
          user.userType = USER_TYPE.CLIENT.toUpperCase();
          user.currentOtp = generateOTP();
          user = await transactionalEntityManager.save(user);
          const sendEmailResult = await this.emailService.sendEmailVerification(dto.email, user.userCode, user.currentOtp);
          if(!sendEmailResult) {
            throw new Error("Error sending email verification!");
          }

          user.userCode = generateIndentityCode(user.userId);
          user = await transactionalEntityManager.save(Users, user);
          delete user.password;
          return user;
        }
      );
    } catch (ex) {
      if (
        ex["message"] &&
        (ex["message"].includes("duplicate key") ||
          ex["message"].includes("violates unique constraint")) &&
        ex["message"].includes("u_username")
      ) {
        throw Error("Email already used!");
      } else {
        throw ex;
      }
    }
  }

  async registerVerify(dto: VerifyClientUserDto) {
    try {
      return await this.userRepo.manager.transaction(
        async (transactionalEntityManager) => {
          let user = await transactionalEntityManager.findOneBy(Users, {
            email: dto.email,
          });

          if(!user) {
            throw Error("Email not found!");
          }
          else if(user && user.isVerifiedUser) {
            throw Error("Email already verified!");
          } else if(user && user.currentOtp.toString().trim() !== dto.otp.toString().trim()) {
            throw Error("Invalid code!");
          }
          user.isVerifiedUser = true;
          user = await transactionalEntityManager.save(Users, user);
          delete user.password;
          return user;
        }
      );
    } catch (ex) {
      throw ex;
    }
  }

  async getByCredentials({userName, password }) {
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
        throw Error(LOGIN_ERROR_USER_NOT_FOUND);
      }

      const passwordMatch = await compare(user.password, password);
      if (!passwordMatch) {
        throw Error(LOGIN_ERROR_PASSWORD_INCORRECT);
      }
      if (!user.accessGranted) {
        throw Error(LOGIN_ERROR_PENDING_ACCESS_REQUEST);
      }
      delete user.password;

      return user;
    } catch(ex) {
      throw ex;
    }
  }

  async getAdminByCredentials({userName, password }) {
    try {
      let user = await this.userRepo.findOne({
        where: {
          userName,
          active: true,
          userType: In([USER_TYPE.ADMIN.toUpperCase()])
        },
        relations: {
          access: true,
          userProfilePic: {
            file: true,
          },
        }
      });
      if (!user) {
        throw Error(LOGIN_ERROR_USER_NOT_FOUND);
      }

      const passwordMatch = await compare(user.password, password);
      if (!passwordMatch) {
        throw Error(LOGIN_ERROR_PASSWORD_INCORRECT);
      }
      if (!user.accessGranted) {
        throw Error(LOGIN_ERROR_PENDING_ACCESS_REQUEST);
      }
      delete user.password;
      const totalUnreadNotif = await this.notificationService.getUnreadByUser(user.userId)
      return {
        ...user,
        totalUnreadNotif 
      };
    } catch(ex) {
      throw ex;
    }
  }
  
  async getClientByCredentials({userName, password }) {
    try {
      let user = await this.userRepo.findOne({
        where: {
          userName,
          active: true,
          userType: USER_TYPE.CLIENT.toUpperCase()
        },
        relations: {
          userProfilePic: {
            file: true,
          },
        }
      });
      if (!user) {
        throw Error(LOGIN_ERROR_USER_NOT_FOUND);
      }

      const passwordMatch = await compare(user.password, password);
      if (!passwordMatch) {
        throw Error(LOGIN_ERROR_PASSWORD_INCORRECT);
      }
      if (!user.accessGranted) {
        throw Error(LOGIN_ERROR_PENDING_ACCESS_REQUEST);
      }
      delete user.password;
      const totalUnreadNotif = await this.notificationService.getUnreadByUser(user.userId)
      return {
        ...user,
        totalUnreadNotif 
      };
    } catch(ex) {
      throw ex;
    }
  }

  async verifyUser(userCode, hash) {
    try {
      return await this.userRepo.manager.transaction(async (entityManager) => {
        let user = await entityManager.findOne(Users, {
          where: {
            userCode
          }
        });
        if(!user) {
          throw Error("Invalid user code");
        }
        if(user.isVerifiedUser) {
          throw Error("User was already verified!");
        }
        const match = await compare(hash, user.currentOtp);
        if (!match) {
          throw Error("Invalid code");
        }
        user.isVerifiedUser = true;
        user = await entityManager.save(Users, user);
        delete user.password;
        return true;
      });
    } catch(ex) {
      throw ex;
    }
  }

  async resetPasswordSubmit(dto: ResetPasswordSubmitDto) {
    try {
      return await this.userRepo.manager.transaction(async (entityManager) => {
        let user = await entityManager.findOne(Users, {
          where: {
            email: dto.email
          }
        });
        if(!user) {
          throw Error("Email not found!");
        }
        if(!user.isVerifiedUser) {
          throw Error("User was not yet verified!");
        }
        user.currentOtp = generateOTP();
        user = await entityManager.save(Users, user);
        const sendEmailResult = await this.emailService.sendResetPasswordOtp(dto.email, user.userCode, user.currentOtp);
        if(!sendEmailResult) {
          throw new Error("Error sending email verification!");
        }
        delete user.password;
        return true;
      });
    } catch(ex) {
      throw ex;
    }
  }

  async resetPasswordVerify(dto: ResetVerifyDto) {
    try {
      return await this.userRepo.manager.transaction(async (entityManager) => {
        let user = await entityManager.findOne(Users, {
          where: {
            email: dto.email
          }
        });
        if(!user) {
          throw Error("Email not found!");
        }
        if(!user.isVerifiedUser) {
          throw Error("User was not yet verified!");
        }
        const match = user.currentOtp === dto.otp;
        if (!match) {
          throw Error("Invalid code");
        }
        return true;
      });
    } catch(ex) {
      throw ex;
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      return await this.userRepo.manager.transaction(async (entityManager) => {
        let user = await entityManager.findOne(Users, {
          where: {
            email: dto.email
          }
        });
        if(!user) {
          throw Error("Email not found!");
        }
        if(!user.isVerifiedUser) {
          throw Error("User was not yet verified!");
        }
        const match = user.currentOtp === dto.otp;
        if (!match) {
          throw Error("Invalid code");
        }
        user.password = await hash(dto.password);
        user = await entityManager.save(Users, user);
        delete user.password;
        return user;
      });
    } catch(ex) {
      throw ex;
    }
  }
}
