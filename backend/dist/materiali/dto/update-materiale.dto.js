"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMaterialeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_materiale_dto_1 = require("./create-materiale.dto");
class UpdateMaterialeDto extends (0, swagger_1.PartialType)(create_materiale_dto_1.CreateMaterialeDto) {
}
exports.UpdateMaterialeDto = UpdateMaterialeDto;
//# sourceMappingURL=update-materiale.dto.js.map