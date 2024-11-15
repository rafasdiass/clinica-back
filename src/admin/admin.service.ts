import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Statistics } from './entities/statistics.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  /**
   * Obtém estatísticas administrativas do sistema.
   * @returns Estatísticas gerais.
   */
  async getStatistics(): Promise<Statistics> {
    const totalDoctors = await this.doctorRepository.count();
    const totalAppointments = await this.appointmentRepository.count();
    const completedAppointments = await this.appointmentRepository.count({
      where: { status: 'completed' },
    });
    const canceledAppointments = await this.appointmentRepository.count({
      where: { status: 'canceled' },
    });

    const totalRevenue = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .getRawOne();

    return {
      totalDoctors,
      totalPatients: 0, // Adicione lógica para contar pacientes se necessário
      totalAppointments,
      totalRevenue: parseFloat(totalRevenue?.total || '0'),
      completedAppointments,
      canceledAppointments,
    };
  }
}
