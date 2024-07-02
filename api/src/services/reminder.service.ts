import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { columnDefToTypeORMCondition } from "src/common/utils/utils";
import { LessThan, Repository } from "typeorm";
import { PusherService } from "./pusher.service";
import { OneSignalNotificationService } from "./one-signal-notification.service";
import { Users } from "src/db/entities/Users";
import { Notifications } from "src/db/entities/Notifications";
import moment from "moment";

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepo: Repository<Notifications>,
    private pusherService: PusherService,
    private oneSignalNotificationService: OneSignalNotificationService
  ) {}

  async sendDueReminder({ date }) {
    try {
    } catch (ex) {
      throw ex;
    }
  }
}
