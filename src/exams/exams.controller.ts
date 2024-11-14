import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  /**
   * Retorna todos os exames baseados nas permissões do usuário logado.
   */
  @Get()
  findAll(@Req() req: { user: User }) {
    return this.examsService.findAll(req.user);
  }

  /**
   * Retorna todos os tipos de exames disponíveis.
   */
  @Get('types')
  findAllTypes() {
    return this.examsService.findAllTypes();
  }

  /**
   * Cria um novo exame.
   */
  @Post()
  create(@Body() createExamDto: CreateExamDto, @Req() req: { user: User }) {
    return this.examsService.create(createExamDto);
  }

  /**
   * Atualiza um exame existente.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExamDto: UpdateExamDto,
    @Req() req: { user: User },
  ) {
    return this.examsService.update(+id, updateExamDto, req.user);
  }

  /**
   * Remove um exame existente.
   */
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: { user: User }) {
    return this.examsService.remove(+id, req.user);
  }
}
