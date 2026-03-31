"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_user_dto_1 = require("../../users/dto/create-user.dto");
class RegisterDto extends (0, swagger_1.PickType)(create_user_dto_1.CreateUserDto, [
    'email',
    'password',
    'firstName',
    'lastName',
]) {
}
exports.RegisterDto = RegisterDto;
//# sourceMappingURL=register.dto.js.map