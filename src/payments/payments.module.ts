import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { DataSource } from 'typeorm'; // Importação do DataSource

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Appointment]), // Registra os repositórios no TypeORM
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    {
      provide: 'PAYMENT_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Payment),
      inject: [DataSource], // Injeta o DataSource para criar o repositório
    },
    {
      provide: 'APPOINTMENT_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Appointment),
      inject: [DataSource], // Injeta o DataSource para criar o repositório
    },
  ],
  exports: [PaymentsService, TypeOrmModule], // Exporta o serviço e o TypeOrmModule
})
export class PaymentsModule {}
