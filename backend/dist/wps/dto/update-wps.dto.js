"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWpsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_wps_dto_1 = require("./create-wps.dto");
class UpdateWpsDto extends (0, swagger_1.PartialType)(create_wps_dto_1.CreateWpsDto) {
}
exports.UpdateWpsDto = UpdateWpsDto;
//# sourceMappingURL=update-wps.dto.js.map