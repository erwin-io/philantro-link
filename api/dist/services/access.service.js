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
exports.AccessService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const access_constant_1 = require("../common/constant/access.constant");
const utils_1 = require("../common/utils/utils");
const Access_1 = require("../db/entities/Access");
const typeorm_2 = require("typeorm");
let AccessService = class AccessService {
    constructor(accessRepo) {
        this.accessRepo = accessRepo;
    }
    async getAccessPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.accessRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                skip,
                take,
                order,
            }),
            this.accessRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getByCode(accessCode) {
        const result = await this.accessRepo.findOne({
            select: {
                name: true,
                accessPages: true,
            },
            where: {
                accessCode,
                active: true,
            },
        });
        if (!result) {
            throw Error(access_constant_1.ACCESS_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.accessRepo.manager.transaction(async (entityManager) => {
            let access = new Access_1.Access();
            access.name = dto.name;
            access.accessPages = dto.accessPages;
            access = await entityManager.save(access);
            access.accessCode = (0, utils_1.generateIndentityCode)(access.accessId);
            return await entityManager.save(Access_1.Access, access);
        });
    }
    async update(accessCode, dto) {
        return await this.accessRepo.manager.transaction(async (entityManager) => {
            const access = await entityManager.findOne(Access_1.Access, {
                where: {
                    accessCode,
                    active: true,
                },
            });
            if (!access) {
                throw Error(access_constant_1.ACCESS_ERROR_NOT_FOUND);
            }
            access.name = dto.name;
            access.accessPages = dto.accessPages;
            return await entityManager.save(Access_1.Access, access);
        });
    }
    async delete(accessCode) {
        return await this.accessRepo.manager.transaction(async (entityManager) => {
            const access = await entityManager.findOne(Access_1.Access, {
                where: {
                    accessCode,
                    active: true,
                },
            });
            if (!access) {
                throw Error(access_constant_1.ACCESS_ERROR_NOT_FOUND);
            }
            access.active = false;
            return await entityManager.save(Access_1.Access, access);
        });
    }
};
AccessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Access_1.Access)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AccessService);
exports.AccessService = AccessService;
//# sourceMappingURL=access.service.js.map