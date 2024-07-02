import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EVENT_STATUS } from "src/common/constant/events.constant";
import { USER_TYPE } from "src/common/constant/user-type.constant";
import { EventsByGeoDto } from "src/controller/dashboard/dashboard.controller";
import { Events } from "src/db/entities/Events";
import { SupportTicket } from "src/db/entities/SupportTicket";
import { Transactions } from "src/db/entities/Transactions";
import { Users } from "src/db/entities/Users";
import { In, Repository } from "typeorm";

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
}
