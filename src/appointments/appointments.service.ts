import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from '../users/entities/user.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Payment } from 'src/payments/entities/payment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const { patientId, doctorId, payments, ...rest } = createAppointmentDto;

    const patient = await this.userRepository.findOne({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    const doctor = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
    }

    const appointment = this.appointmentRepository.create({
      ...rest,
      patient,
      doctor,
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);

    if (payments && payments.length > 0) {
      const paymentEntities = payments.map((payment) =>
        this.paymentRepository.create({
          ...payment,
          appointment: savedAppointment,
        }),
      );

      await this.paymentRepository.save(paymentEntities);
    }

    return this.findOne(savedAppointment.id); // Retorna com os pagamentos
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const { payments, ...rest } = updateAppointmentDto;

    const appointment = await this.findOne(id);
    Object.assign(appointment, rest);

    const updatedAppointment =
      await this.appointmentRepository.save(appointment);

    if (payments && payments.length > 0) {
      // Remove os pagamentos antigos e adiciona os novos
      await this.paymentRepository.delete({ appointment: updatedAppointment });

      const paymentEntities = payments.map((payment) =>
        this.paymentRepository.create({
          ...payment,
          appointment: updatedAppointment,
        }),
      );

      await this.paymentRepository.save(paymentEntities);
    }

    return this.findOne(updatedAppointment.id);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
  }
}
