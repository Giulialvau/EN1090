"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChecklistDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_checklist_dto_1 = require("./create-checklist.dto");
class UpdateChecklistDto extends (0, swagger_1.PartialType)(create_checklist_dto_1.CreateChecklistDto) {
}
exports.UpdateChecklistDto = UpdateChecklistDto;
//# sourceMappingURL=update-checklist.dto.js.map