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

@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  /**
   * Retorna todos os exames.
   */
  @Get()
  findAll() {
    return this.examsService.findAll();
  }

  /**
   * Retorna um exame específico se o usuário tiver permissão.
   */
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.examsService.findOne(+id, req.user); // Inclui `req.user` para o método `findOne`.
  }

  /**
   * Cria um novo exame.
   */
  @Post()
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  /**
   * Atualiza um exame existente.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExamDto: UpdateExamDto,
    @Req() req,
  ) {
    return this.examsService.update(+id, updateExamDto, req.user); // Inclui `req.user` para o método `update`.
  }

  /**
   * Remove um exame existente.
   */
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.examsService.remove(+id, req.user); // Inclui `req.user` para o método `remove`.
  }
}
