import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EVENT_STATUS } from "src/common/constant/events.constant";
import { USER_TYPE } from "src/common/constant/user-type.constant";
import {
  ClientEventFeedDto,
  ClientHelpFeedDto,
  EventsByGeoDto,
} from "src/controller/dashboard/dashboard.controller";
import { Events } from "src/db/entities/Events";
import { SupportTicket } from "src/db/entities/SupportTicket";
import { Transactions } from "src/db/entities/Transactions";
import { Users } from "src/db/entities/Users";
import { In, Repository } from "typeorm";
import { USER_ERROR_USER_NOT_FOUND } from "../common/constant/user-error.constant";

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    @InjectRepository(Events)
    private readonly eventsRepo: Repository<Events>,
    @InjectRepository(SupportTicket)
    private readonly supportTicketRepo: Repository<SupportTicket>,
    @InjectRepository(Transactions)
    private readonly transactionsRepo: Repository<Transactions>
  ) {}

  async getDashboardSummary() {
    const [
      totalClients,
      totalEventsPending,
      totalEventsRegistered,
      totalSupportTicket,
    ] = await Promise.all([
      this.usersRepo.count({
        where: {
          userType: USER_TYPE.CLIENT,
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
          eventStatus: In(["APPROVED", "INPROGRESS", "COMPLETED"]),
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

  async getEventsByGeo(params: EventsByGeoDto) {
    let status = `'PENDING', 'APPROVED', 'INPROGRESS', 'COMPLETED'`;
    if (params.status === EVENT_STATUS.PENDING) {
      status = `'PENDING'`;
    } else if (params.status === "REGISTERED") {
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
        eventId: In(eventIds),
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
      delete x.user?.password;
      return {
        ...x,
      };
    });
  }

  async getClientEventFeed(params: ClientEventFeedDto) {
    const user = await this.usersRepo.findOneBy({ userCode: params?.userCode });
    if (!user) {
      throw new Error(USER_ERROR_USER_NOT_FOUND);
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
                ll_to_earth(${params.latitude}::float, ${
      params.longitude
    }::float),
                ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float)
              ) AS distance
        FROM dbo."Events"
        WHERE "UserId" <> '${user.userId}' AND "EventType" IN(${
      params.eventType.length > 1
        ? `'` + params.eventType.join(`','`) + `'`
        : `'` + params.eventType + `'`
    }) AND "EventStatus" = 'APPROVED' ${queryWildCard} AND earth_box(ll_to_earth(${
      params.latitude
    }::float, ${params.longitude}::float), ${
      params.radius
    }::float) @> ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float)
          AND earth_distance(ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float), ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float)) <= ${
            params.radius
          }::float
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
        LIMIT ${
          params.limit <= 0 || isNaN(Number(params.limit))
            ? `CASE
                WHEN (SELECT cnt FROM row_count) > 500 THEN (SELECT CEIL(0.1 * cnt) FROM row_count)
                ELSE (SELECT cnt FROM row_count)
              END`
            : params.limit + ` OFFSET ${params.skip}`
        }
      )
      SELECT *,(SELECT COUNT(*) FROM radius_data) AS total
      FROM sampled_data`;

    const events: {
      eventId: string;
      total: string;
      interested: string;
      responded: string;
      raisedDonation: string;
    }[] = await this.eventsRepo.query(query).then((res) =>
      res.map((e) => {
        return {
          eventId: e["eventId"],
          total: e["total"],
          interested: e["interested"],
          responded: e["responded"],
          raisedDonation: e["raisedDonation"],
        };
      })
    );
    const result = await this.eventsRepo.find({
      where: {
        eventId: In(events.map((x) => x.eventId)),
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
        delete x.user?.password;
        return {
          ...x,
          interested: events.some((e) => e.eventId === x.eventId)
            ? Number(events.find((e) => e.eventId === x.eventId)?.interested)
            : 0,
          responded: events.some((e) => e.eventId === x.eventId)
            ? Number(events.find((e) => e.eventId === x.eventId)?.responded)
            : 0,
          raisedDonation: events.some((e) => e.eventId === x.eventId)
            ? Number(
                events.find((e) => e.eventId === x.eventId)?.raisedDonation
              )
            : 0,
        };
      }),
      total: events[0]?.total ?? 0,
    };
  }

  async getClientHelpFeed(params: ClientHelpFeedDto) {
    const user = await this.usersRepo.findOneBy({ userCode: params?.userCode });
    if (!user) {
      throw new Error(USER_ERROR_USER_NOT_FOUND);
    }
    const query = `
      WITH radius_data AS (
        SELECT "EventId" as "eventId",
              earth_distance(
                ll_to_earth(${params.latitude}::float, ${
      params.longitude
    }::float),
                ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float)
              ) AS distance
        FROM dbo."Events"
        WHERE "UserId" <> '${
          user.userId
        }' AND "EventType" = 'ASSISTANCE' AND ("EventAssistanceItems" && ARRAY[${
      params.helpType.length > 1
        ? `'` + params.helpType.join(`','`) + `'`
        : `'` + params.helpType + `'`
    }]::varchar[]) AND "EventStatus" = 'APPROVED' AND earth_box(ll_to_earth(${
      params.latitude
    }::float, ${params.longitude}::float), ${
      params.radius
    }::float) @> ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float)
          AND earth_distance(ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float), ll_to_earth(("EventLocMap"->>'latitude')::float, ("EventLocMap"->>'longitude')::float)) <= ${
            params.radius
          }::float
      ),
      row_count AS (
        SELECT COUNT(*) AS cnt FROM radius_data
      ),
      sampled_data AS (
        SELECT *
        FROM radius_data
        ORDER BY distance,random() ASC
        LIMIT ${
          params.limit <= 0 || isNaN(Number(params.limit))
            ? `CASE
                WHEN (SELECT cnt FROM row_count) > 500 THEN (SELECT CEIL(0.1 * cnt) FROM row_count)
                ELSE (SELECT cnt FROM row_count)
              END`
            : params.limit + ` OFFSET ${params.skip}`
        }
      )
      SELECT *,(SELECT COUNT(*) FROM radius_data) AS total
      FROM sampled_data`;

    const events: { eventId: string; total: string }[] = await this.eventsRepo
      .query(query)
      .then((res) =>
        res.map((e) => {
          return {
            eventId: e["eventId"],
            total: e["total"],
          };
        })
      );
    const result = await this.eventsRepo.find({
      where: {
        eventId: In(events.map((x) => x.eventId)),
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
        delete x.user?.password;
        return {
          ...x,
        };
      }),
      total: events[0]?.total ?? 0,
    };
  }
}
