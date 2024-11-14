import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../shared/guards/roles.guard';

@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  /**
   * Retorna todos os agendamentos.
   */
  @Get()
  @Roles('admin', 'employee', 'doctor')
  findAll() {
    return this.schedulesService.findAll();
  }

  /**
   * Retorna um agendamento pelo ID.
   */
  @Get(':id')
  @Roles('admin', 'employee', 'doctor')
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(+id);
  }

  /**
   * Cria agendamentos com slots de 15 minutos.
   */
  @Post()
  @Roles('admin', 'employee')
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.createWithSlots(createScheduleDto);
  }

  /**
   * Atualiza um agendamento.
   */
  @Patch(':id')
  @Roles('admin', 'employee')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(+id, updateScheduleDto);
  }

  /**
   * Remove um agendamento.
   */
  @Delete(':id')
  @Roles('admin', 'employee')
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(+id);
  }
}
