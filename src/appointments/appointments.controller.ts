import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /**
   * Retorna todas as consultas.
   */
  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  /**
   * Retorna uma consulta específica pelo ID.
   * @param id ID da consulta
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  /**
   * Cria uma nova consulta, incluindo pagamentos associados (opcional).
   * @param createAppointmentDto Dados para criar a consulta
   */
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  /**
   * Atualiza uma consulta existente, permitindo também a atualização de pagamentos associados.
   * @param id ID da consulta
   * @param updateAppointmentDto Dados para atualizar a consulta
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  /**
   * Remove uma consulta específica pelo ID.
   * @param id ID da consulta
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}
