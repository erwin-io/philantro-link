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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemConfigService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const moment_1 = __importDefault(require("moment"));
const date_constant_1 = require("../common/constant/date.constant");
const system_config_constant_1 = require("../common/constant/system-config.constant");
const firebase_provider_1 = require("../core/provider/firebase/firebase-provider");
const SystemConfig_1 = require("../db/entities/SystemConfig");
const typeorm_2 = require("typeorm");
let SystemConfigService = class SystemConfigService {
    constructor(firebaseProvoder, systemConfigRepo) {
        this.firebaseProvoder = firebaseProvoder;
        this.systemConfigRepo = systemConfigRepo;
    }
    getAll() {
        return this.systemConfigRepo.find();
    }
    async update({ key, value }) {
        return await this.systemConfigRepo.manager.transaction(async (entityManager) => {
            const systemConfig = await entityManager.findOne(SystemConfig_1.SystemConfig, {
                where: {
                    key,
                },
            });
            if (!systemConfig) {
                throw Error(system_config_constant_1.SYSTEMCONFIG_ERROR_NOT_FOUND);
            }
            systemConfig.value = value;
            return await entityManager.save(SystemConfig_1.SystemConfig, systemConfig);
        });
    }
    find(key) {
        return this.systemConfigRepo.findOneBy({
            key,
        });
    }
    async getServerDate(date) {
        const dateTime = (0, moment_1.default)(new Date(date), date_constant_1.DateConstant.DATE_LANGUAGE).toISOString();
        const date1 = await this.systemConfigRepo
            .query(`select ('${date}') AT TIME ZONE 'Asia/Manila' as date1`)
            .then((res) => {
            return res[0].date1;
        });
        const date2 = await this.systemConfigRepo
            .query(`select '${date}'::TIMESTAMPTZ as date2`)
            .then((res) => {
            return res[0].date2;
        });
        return {
            date1,
            date2,
            dateTime,
        };
    }
};
SystemConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(SystemConfig_1.SystemConfig)),
    __metadata("design:paramtypes", [firebase_provider_1.FirebaseProvider,
        typeorm_2.Repository])
], SystemConfigService);
exports.SystemConfigService = SystemConfigService;
//# sourceMappingURL=system-config.service.js.map