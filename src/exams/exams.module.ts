import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { Exam } from './entities/exam.entity';
import { User } from '../users/entities/user.entity';
import { Doctor } from '../doctors/entities/doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, User, Doctor])],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService], // Exportar caso seja necessário usar fora do módulo
})
export class ExamsModule {}
