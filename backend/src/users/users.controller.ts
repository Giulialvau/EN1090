import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
@ApiTags("users")
@ApiBearerAuth("bearer")
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@ApiBadRequestResponse({ description: "Bad Request" })
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: "Utente creato" })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: "Elenco utenti" })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: "Dettaglio utente" })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: "Utente aggiornato" })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: "Utente eliminato" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
