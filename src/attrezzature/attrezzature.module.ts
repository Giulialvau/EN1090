import { Module } from "@nestjs/common";

import { AttrezzatureController } from "./attrezzature.controller";
import { AttrezzatureService } from "./attrezzature.service";

@Module({
  controllers: [AttrezzatureController],
  providers: [AttrezzatureService],
})
export class AttrezzatureModule {}
