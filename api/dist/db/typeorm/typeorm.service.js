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
exports.TypeOrmConfigService = void 0;
const Users_1 = require("../entities/Users");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const Access_1 = require("../entities/Access");
const Notifications_1 = require("../entities/Notifications");
const UserProfilePic_1 = require("../entities/UserProfilePic");
const Files_1 = require("../entities/Files");
const UserOneSignalSubscription_1 = require("../entities/UserOneSignalSubscription");
const SystemConfig_1 = require("../entities/SystemConfig");
const Events_1 = require("../entities/Events");
const EventImage_1 = require("../entities/EventImage");
const EventMessage_1 = require("../entities/EventMessage");
const Transactions_1 = require("../entities/Transactions");
const Interested_1 = require("../entities/Interested");
const Responded_1 = require("../entities/Responded");
const SupportTicket_1 = require("../entities/SupportTicket");
const SupportTicketMessage_1 = require("../entities/SupportTicketMessage");
let TypeOrmConfigService = class TypeOrmConfigService {
    createTypeOrmOptions() {
        const ssl = this.config.get("SSL");
        const config = {
            type: "postgres",
            host: this.config.get("DATABASE_HOST"),
            port: Number(this.config.get("DATABASE_PORT")),
            database: this.config.get("DATABASE_NAME"),
            username: this.config.get("DATABASE_USER"),
            password: this.config.get("DATABASE_PASSWORD"),
            entities: [
                Users_1.Users,
                UserProfilePic_1.UserProfilePic,
                Files_1.Files,
                Access_1.Access,
                Notifications_1.Notifications,
                UserOneSignalSubscription_1.UserOneSignalSubscription,
                SystemConfig_1.SystemConfig,
                Events_1.Events,
                EventImage_1.EventImage,
                EventMessage_1.EventMessage,
                Transactions_1.Transactions,
                Interested_1.Interested,
                Responded_1.Responded,
                SupportTicket_1.SupportTicket,
                SupportTicketMessage_1.SupportTicketMessage
            ],
            synchronize: false,
            ssl: ssl.toLocaleLowerCase().includes("true"),
            extra: {},
        };
        if (config.ssl) {
            config.extra.ssl = {
                require: true,
                rejectUnauthorized: false,
            };
        }
        return config;
    }
};
__decorate([
    (0, common_1.Inject)(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], TypeOrmConfigService.prototype, "config", void 0);
TypeOrmConfigService = __decorate([
    (0, common_1.Injectable)()
], TypeOrmConfigService);
exports.TypeOrmConfigService = TypeOrmConfigService;
//# sourceMappingURL=typeorm.service.js.map