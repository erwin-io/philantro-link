import { Module } from "@nestjs/common";
import { SystemConfigController } from "./system-config.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { SystemConfig } from "src/db/entities/SystemConfig";
import { SystemConfigService } from "src/services/system-config.service";

@Module({
  imports: [FirebaseProviderModule, TypeOrmModule.forFeature([SystemConfig])],
  controllers: [SystemConfigController],
  providers: [SystemConfigService],
  exports: [SystemConfigService],
})
export class SystemConfigModule {}
