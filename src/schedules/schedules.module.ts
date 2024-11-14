import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { Schedule } from './entities/schedule.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { DoctorsModule } from '../doctors/doctors.module'; // Importa o módulo dos médicos

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, Doctor]), // Registra as entidades no TypeORM
    DoctorsModule, // Importa o módulo dos médicos
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService], // Exporta o serviço caso seja necessário em outros módulos
})
export class SchedulesModule {}
