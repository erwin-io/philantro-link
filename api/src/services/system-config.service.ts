import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { DateConstant } from "src/common/constant/date.constant";
import { SYSTEMCONFIG_ERROR_NOT_FOUND } from "src/common/constant/system-config.constant";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { SystemConfig } from "src/db/entities/SystemConfig";
import { Repository } from "typeorm";

@Injectable()
export class SystemConfigService {
  constructor(
    private firebaseProvoder: FirebaseProvider,
    @InjectRepository(SystemConfig)
    private readonly systemConfigRepo: Repository<SystemConfig>
  ) {}

  getAll() {
    return this.systemConfigRepo.find();
  }

  async update({ key, value }) {
    return await this.systemConfigRepo.manager.transaction(
      async (entityManager) => {
        const systemConfig = await entityManager.findOne(SystemConfig, {
          where: {
            key,
          },
        });

        if (!systemConfig) {
          throw Error(SYSTEMCONFIG_ERROR_NOT_FOUND);
        }

        systemConfig.value = value;
        return await entityManager.save(SystemConfig, systemConfig);
      }
    );
  }

  find(key) {
    return this.systemConfigRepo.findOneBy({
      key,
    });
  }
  async getServerDate(date) {
    const dateTime = moment(
      new Date(date),
      DateConstant.DATE_LANGUAGE
    ).toISOString();

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
}
