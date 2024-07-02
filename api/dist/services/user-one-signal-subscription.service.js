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
exports.UserOneSignalSubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_error_constant_1 = require("../common/constant/user-error.constant");
const user_one_signal_subscription_constant_1 = require("../common/constant/user-one-signal-subscription.constant");
const UserOneSignalSubscription_1 = require("../db/entities/UserOneSignalSubscription");
const Users_1 = require("../db/entities/Users");
const typeorm_2 = require("typeorm");
const pusher_service_1 = require("./pusher.service");
const one_signal_notification_service_1 = require("./one-signal-notification.service");
let UserOneSignalSubscriptionService = class UserOneSignalSubscriptionService {
    constructor(ueserFirebaseTokensRepo, pusherService, oneSignalNotificationService) {
        this.ueserFirebaseTokensRepo = ueserFirebaseTokensRepo;
        this.pusherService = pusherService;
        this.oneSignalNotificationService = oneSignalNotificationService;
    }
    async getBySubscriptionId(subscriptionId) {
        var _a;
        const result = await this.ueserFirebaseTokensRepo.findOne({
            where: {
                subscriptionId,
            },
            relations: {
                user: true,
            },
        });
        if (!result) {
            throw Error(user_one_signal_subscription_constant_1.USER_ONE_SIGNAL_SUBSCRIPTION_ERROR_USER_NOT_FOUND);
        }
        if ((_a = result === null || result === void 0 ? void 0 : result.user) === null || _a === void 0 ? void 0 : _a.password) {
            delete result.user.password;
        }
        return result;
    }
    async create(dto) {
        return this.ueserFirebaseTokensRepo.manager.transaction(async (entityManager) => {
            let userOneSignalSubscription = await entityManager.findOne(UserOneSignalSubscription_1.UserOneSignalSubscription, {
                where: {
                    subscriptionId: dto.subscriptionId,
                },
                relations: {
                    user: true,
                },
            });
            if (!userOneSignalSubscription) {
                userOneSignalSubscription = new UserOneSignalSubscription_1.UserOneSignalSubscription();
                const user = await entityManager.findOne(Users_1.Users, {
                    where: {
                        userId: dto.userId,
                        active: true,
                    },
                });
                if (!user) {
                    throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
                }
                userOneSignalSubscription.user = user;
                userOneSignalSubscription.subscriptionId = dto.subscriptionId;
            }
            userOneSignalSubscription = await entityManager.save(UserOneSignalSubscription_1.UserOneSignalSubscription, userOneSignalSubscription);
            delete userOneSignalSubscription.user.password;
            return userOneSignalSubscription;
        });
    }
};
UserOneSignalSubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(UserOneSignalSubscription_1.UserOneSignalSubscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pusher_service_1.PusherService,
        one_signal_notification_service_1.OneSignalNotificationService])
], UserOneSignalSubscriptionService);
exports.UserOneSignalSubscriptionService = UserOneSignalSubscriptionService;
//# sourceMappingURL=user-one-signal-subscription.service.js.map