import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';
import { Appointment } from '../appointments/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Appointment])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [PaymentsService], // Exportação para uso em outros módulos
})
export class PaymentsModule {}
