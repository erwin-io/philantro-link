import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
}
