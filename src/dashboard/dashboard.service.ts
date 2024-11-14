import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async getSummary(): Promise<DashboardSummaryDto> {
    const totalUsers = await this.userRepository.count();
    const totalAppointments = await this.appointmentRepository.count();
    const totalDoctors = await this.doctorRepository.count();
    const totalActiveAppointments = await this.appointmentRepository.count({
      where: { status: 'active' },
    });

    return {
      totalUsers,
      totalAppointments,
      totalDoctors,
      totalActiveAppointments,
    };
  }
}
