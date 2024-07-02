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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const events_constant_1 = require("../common/constant/events.constant");
const user_type_constant_1 = require("../common/constant/user-type.constant");
const Events_1 = require("../db/entities/Events");
const SupportTicket_1 = require("../db/entities/SupportTicket");
const Transactions_1 = require("../db/entities/Transactions");
const Users_1 = require("../db/entities/Users");
const typeorm_2 = require("typeorm");
let DashboardService = class DashboardService {
    constructor(usersRepo, eventsRepo, supportTicketRepo, transactionsRepo) {
        this.usersRepo = usersRepo;
        this.eventsRepo = eventsRepo;
        this.supportTicketRepo = supportTicketRepo;
        this.transactionsRepo = transactionsRepo;
    }
    async getDashboardSummary() {
        const [totalClients, totalEventsPending, totalEventsRegistered, totalSupportTicket,] = await Promise.all([
            this.usersRepo.count({
                where: {
                    userType: user_type_constant_1.USER_TYPE.CLIENT,
                    active: true,
                },
            }),
            this.eventsRepo.count({
                where: {
                    eventStatus: "PENDING",
                    active: true,
                },
            }),
            this.eventsRepo.count({
                where: {
                    eventStatus: (0, typeorm_2.In)(["APPROVED", "INPROGRESS", "COMPLETED"]),
                    active: true,
                },
            }),
            this.supportTicketRepo.count({
                where: {
                    active: true,
                    status: "OPEN",
                },
            }),
        ]);
        return {
            totalClients,
            totalEventsPending,
            totalEventsRegistered,
            totalSupportTicket,
        };
    }
    async getEventsByGeo(params) {
        let status = `'PENDING', 'APPROVED', 'INPROGRESS', 'COMPLETED'`;
        if (params.status === events_constant_1.EVENT_STATUS.PENDING) {
            status = `'PENDING'`;
        }
        else if (params.status === "REGISTERED") {
            status = `'APPROVED', 'INPROGRESS', 'COMPLETED'`;
        }
        const query = `
      WITH radius_data AS (
        SELECT "EventId" as "eventId",
              earth_distance(
                ll_to_earth(${params.latitude}::float, ${params.longitude}::float),
                ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float)
              ) AS distance
        FROM dbo."Events"
        WHERE "EventStatus" IN(${status}) AND earth_box(ll_to_earth(${params.latitude}::float, ${params.longitude}::float), ${params.radius}::float) @> ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float)
          AND earth_distance(ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float), ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float)) <= ${params.radius}::float
      ),
      row_count AS (
        SELECT COUNT(*) AS cnt FROM radius_data
      ),
      sampled_data AS (
        SELECT *
        FROM radius_data
        ORDER BY random()
        LIMIT CASE
                WHEN (SELECT cnt FROM row_count) > 500 THEN (SELECT CEIL(0.1 * cnt) FROM row_count)
                ELSE (SELECT cnt FROM row_count)
              END
      )
      SELECT *
      FROM sampled_data;`;
        const eventIds = await this.eventsRepo
            .query(query)
            .then((res) => res.map((e) => e["eventId"]));
        const result = await this.eventsRepo.find({
            where: {
                eventId: (0, typeorm_2.In)(eventIds),
            },
            relations: {
                thumbnailFile: true,
                user: {
                    userProfilePic: {
                        file: true,
                    },
                },
            },
        });
        return result.map((x) => {
            var _a;
            (_a = x.user) === null || _a === void 0 ? true : delete _a.password;
            return Object.assign({}, x);
        });
    }
};
DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __param(1, (0, typeorm_1.InjectRepository)(Events_1.Events)),
    __param(2, (0, typeorm_1.InjectRepository)(SupportTicket_1.SupportTicket)),
    __param(3, (0, typeorm_1.InjectRepository)(Transactions_1.Transactions)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map