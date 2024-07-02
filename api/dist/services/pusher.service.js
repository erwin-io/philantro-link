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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PusherService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Pusher = require("pusher");
let PusherService = class PusherService {
    constructor(config) {
        this.config = config;
        this.pusher = new Pusher({
            appId: this.config.get("PUSHER_APPID"),
            key: this.config.get("PUSHER_KEY"),
            secret: this.config.get("PUSHER_SECRET"),
            cluster: this.config.get("PUSHER_CLUSTER"),
            useTLS: this.config
                .get("PUSHER_USE_TLS")
                .toLowerCase()
                .includes("true"),
        });
    }
    trigger(channel, event, data) {
        this.pusher.trigger(channel, event, data);
    }
    async reSync(type, data) {
        try {
            this.pusher.trigger("all", "reSync", { type, data });
        }
        catch (ex) {
            throw ex;
        }
    }
    async rentBookingChanges(userIds, data) {
        try {
            if (userIds && userIds.length > 0) {
                for (const userId of userIds) {
                    this.pusher.trigger(userId, "rentBookingChanges", data);
                }
            }
            this.pusher.trigger("all", "reSync", {
                type: "TENANT_RENT_BOOKING",
                data: null,
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    async rentContractChanges(userIds, data) {
        try {
            if (userIds && userIds.length > 0) {
                for (const userId of userIds) {
                    this.pusher.trigger(userId, "rentContractChanges", data);
                }
            }
            this.pusher.trigger("all", "reSync", {
                type: "TENANT_RENT_CONTRACT",
                data: null,
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    async billingChanges(userIds, data) {
        try {
            if (userIds && userIds.length > 0) {
                for (const userId of userIds) {
                    this.pusher.trigger(userId, "billingChanges", data);
                }
            }
            this.pusher.trigger("all", "reSync", {
                type: "TENANT_RENT_BILLING_REMINDER",
                data: null,
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    async paymentChanges(userIds, data) {
        try {
            if (userIds && userIds.length > 0) {
                for (const userId of userIds) {
                    this.pusher.trigger(userId, "paymentChanges", data);
                }
            }
            this.pusher.trigger("all", "reSync", {
                type: "TENANT_RENT_CONTRACT_PAYMENT",
                data: null,
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    async sendNotif(userIds, title, description) {
        try {
            if (userIds && userIds.length > 0) {
                for (const userId of userIds) {
                    this.pusher.trigger(userId, "notifAdded", {
                        title,
                        description,
                    });
                }
            }
        }
        catch (ex) {
            throw ex;
        }
    }
};
PusherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PusherService);
exports.PusherService = PusherService;
//# sourceMappingURL=pusher.service.js.map