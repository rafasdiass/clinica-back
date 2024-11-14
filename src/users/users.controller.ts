import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../shared/guards/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Garante autenticação e roles
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retorna todos os usuários (admin e funcionários com permissões limitadas).
   */
  @Get()
  @Roles('admin', 'employee')
  findAll(@Request() req) {
    return this.usersService.findAll(req.user);
  }

  /**
   * Retorna os dados de um usuário pelo ID.
   */
  @Get(':id')
  @Roles('admin', 'doctor', 'patient', 'employee')
  findOne(@Param('id') id: string, @Request() req) {
    return this.usersService.findOne(+id, req.user);
  }

  /**
   * Cria um novo usuário (admin e funcionários com permissões limitadas).
   */
  @Post()
  @Roles('admin', 'employee')
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.usersService.create(createUserDto, req.user);
  }

  /**
   * Atualiza os dados de um usuário.
   * Pacientes podem atualizar apenas seus próprios dados.
   * Funcionários têm acesso limitado à atualização.
   * Admins podem atualizar dados de qualquer usuário.
   */
  @Patch(':id')
  @Roles('admin', 'patient', 'employee')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.usersService.update(+id, updateUserDto, req.user);
  }

  /**
   * Remove um usuário (apenas admins).
   */
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string, @Request() req) {
    return this.usersService.remove(+id, req.user);
  }
}
