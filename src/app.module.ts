import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PatientsModule } from './patients/patients.module';
import { ExamsModule } from './exams/exams.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Deve ser false em produção para evitar perda de dados.
    }),
    AuthModule,
    UsersModule,
    DoctorsModule,
    SchedulesModule,
    AppointmentsModule,
    DashboardModule,
    PatientsModule,
    ExamsModule,
  ],
})
export class AppModule {}
