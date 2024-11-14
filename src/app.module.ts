import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    // Configuração global para variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Carrega variáveis do arquivo .env
    }),

    // Configuração do banco de dados usando TypeORM
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: process.env.TYPEORM_CONNECTION as 'sqlite', // Banco definido no .env
        database: process.env.TYPEORM_DATABASE || 'database.sqlite', // Nome do arquivo SQLite
        synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true', // Sincronização automática das entidades
        logging: process.env.TYPEORM_LOGGING === 'true', // Habilita logs de queries
        autoLoadEntities: true, // Carrega automaticamente todas as entidades registradas
      }),
    }),

    // Módulos do sistema
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
