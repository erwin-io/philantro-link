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
const user_error_constant_1 = require("../common/constant/user-error.constant");
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
    async getClientEventFeed(params) {
        var _a, _b;
        const user = await this.usersRepo.findOneBy({ userCode: params === null || params === void 0 ? void 0 : params.userCode });
        if (!user) {
            throw new Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
        }
        let queryWildCard = "";
        if (params.keyword && params.keyword !== "") {
            queryWildCard = ` AND (
      LOWER("EventType") like '%${params.keyword.toLowerCase()}%' OR 
      LOWER("EventDesc") like '%${params.keyword.toLowerCase()}%' OR 
      LOWER("EventName") like '%${params.keyword.toLowerCase()}%' OR 
      LOWER("EventLocName") like '%${params.keyword.toLowerCase()}%' OR
      TRIM(LOWER(TO_CHAR("DateTime", 'Day'))) LIKE '%${params.keyword.toLowerCase()}%' OR
      TRIM(LOWER(TO_CHAR("DateTime", 'Month'))) LIKE '%${params.keyword.toLowerCase()}%'
      ) `;
        }
        const query = `
      WITH radius_data AS (
        SELECT "EventId" as "eventId",
        "DonationTargetAmount" as "donationTargetAmount",
              earth_distance(
                ll_to_earth(${params.latitude}::float, ${params.longitude}::float),
                ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float)
              ) AS distance
        FROM dbo."Events"
        WHERE "UserId" <> '${user.userId}' AND "EventType" IN(${params.eventType.length > 1
            ? `'` + params.eventType.join(`','`) + `'`
            : `'` + params.eventType + `'`}) AND "EventStatus" = 'APPROVED' ${queryWildCard} AND earth_box(ll_to_earth(${params.latitude}::float, ${params.longitude}::float), ${params.radius}::float) @> ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float)
          AND earth_distance(ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float), ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float)) <= ${params.radius}::float
      ),
      row_count AS (
        SELECT COUNT(*) AS cnt FROM radius_data
      ),
      interested AS (
        SELECT
        "EventId" as "eventId",
        COALESCE(COUNT(*),0) AS total
        FROM
        dbo."Interested" group by "EventId"
      ),
      responded AS (
        SELECT
        "EventId" as "eventId",
        COALESCE(COUNT(*),0) AS total
        FROM
        dbo."Responded" group by "EventId"

      ),
      donation AS (
        SELECT 
        "EventId" as "eventId",
        COALESCE(SUM("Amount"),0) as total
        FROM dbo."Transactions" 
        WHERE "Status" = 'COMPLETED'
        AND "IsCompleted" = true
        GROUP BY "EventId"

      ),
      sampled_data AS (
        SELECT 
        rd.*,
        COALESCE(i.total,0) as interested,
        COALESCE(r.total,0) as responded,
        COALESCE(d.total,0) as "raisedDonation"
        FROM
        radius_data rd
        left join interested as i ON rd."eventId" = i."eventId" 
        left join responded as r ON rd."eventId" = r."eventId" 
	      left join donation as d ON rd."eventId" = d."eventId" 
        ORDER BY rd.distance,random() ASC
        LIMIT ${params.limit <= 0 || isNaN(Number(params.limit))
            ? `CASE
                WHEN (SELECT cnt FROM row_count) > 500 THEN (SELECT CEIL(0.1 * cnt) FROM row_count)
                ELSE (SELECT cnt FROM row_count)
              END`
            : params.limit + ` OFFSET ${params.skip}`}
      )
      SELECT *,(SELECT COUNT(*) FROM radius_data) AS total
      FROM sampled_data`;
        const events = await this.eventsRepo.query(query).then((res) => res.map((e) => {
            return {
                eventId: e["eventId"],
                total: e["total"],
                interested: e["interested"],
                responded: e["responded"],
                raisedDonation: e["raisedDonation"],
            };
        }));
        const result = await this.eventsRepo.find({
            where: {
                eventId: (0, typeorm_2.In)(events.map((x) => x.eventId)),
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
        return {
            results: result.map((x) => {
                var _a, _b, _c, _d;
                (_a = x.user) === null || _a === void 0 ? true : delete _a.password;
                return Object.assign(Object.assign({}, x), { interested: events.some((e) => e.eventId === x.eventId)
                        ? Number((_b = events.find((e) => e.eventId === x.eventId)) === null || _b === void 0 ? void 0 : _b.interested)
                        : 0, responded: events.some((e) => e.eventId === x.eventId)
                        ? Number((_c = events.find((e) => e.eventId === x.eventId)) === null || _c === void 0 ? void 0 : _c.responded)
                        : 0, raisedDonation: events.some((e) => e.eventId === x.eventId)
                        ? Number((_d = events.find((e) => e.eventId === x.eventId)) === null || _d === void 0 ? void 0 : _d.raisedDonation)
                        : 0 });
            }),
            total: (_b = (_a = events[0]) === null || _a === void 0 ? void 0 : _a.total) !== null && _b !== void 0 ? _b : 0,
        };
    }
    async getClientHelpFeed(params) {
        var _a, _b;
        const user = await this.usersRepo.findOneBy({ userCode: params === null || params === void 0 ? void 0 : params.userCode });
        if (!user) {
            throw new Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
        }
        const query = `
      WITH radius_data AS (
        SELECT "EventId" as "eventId",
              earth_distance(
                ll_to_earth(${params.latitude}::float, ${params.longitude}::float),
                ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float)
              ) AS distance
        FROM dbo."Events"
        WHERE "UserId" <> '${user.userId}' AND "EventType" = 'ASSISTANCE' AND ("EventAssistanceItems" && ARRAY[${params.helpType.length > 1
            ? `'` + params.helpType.join(`','`) + `'`
            : `'` + params.helpType + `'`}]::varchar[]) AND "EventStatus" = 'APPROVED' AND earth_box(ll_to_earth(${params.latitude}::float, ${params.longitude}::float), ${params.radius}::float) @> ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float)
          AND earth_distance(ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float), ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float)) <= ${params.radius}::float
      ),
      row_count AS (
        SELECT COUNT(*) AS cnt FROM radius_data
      ),
      sampled_data AS (
        SELECT *
        FROM radius_data
        ORDER BY distance,random() ASC
        LIMIT ${params.limit <= 0 || isNaN(Number(params.limit))
            ? `CASE
                WHEN (SELECT cnt FROM row_count) > 500 THEN (SELECT CEIL(0.1 * cnt) FROM row_count)
                ELSE (SELECT cnt FROM row_count)
              END`
            : params.limit + ` OFFSET ${params.skip}`}
      )
      SELECT *,(SELECT COUNT(*) FROM radius_data) AS total
      FROM sampled_data`;
        const events = await this.eventsRepo
            .query(query)
            .then((res) => res.map((e) => {
            return {
                eventId: e["eventId"],
                total: e["total"],
            };
        }));
        const result = await this.eventsRepo.find({
            where: {
                eventId: (0, typeorm_2.In)(events.map((x) => x.eventId)),
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
        return {
            results: result.map((x) => {
                var _a;
                (_a = x.user) === null || _a === void 0 ? true : delete _a.password;
                return Object.assign({}, x);
            }),
            total: (_b = (_a = events[0]) === null || _a === void 0 ? void 0 : _a.total) !== null && _b !== void 0 ? _b : 0,
        };
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