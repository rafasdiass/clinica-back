import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from '../users/entities/user.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Payment } from '../payments/entities/payment.entity';

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

  /**
   * Retorna todos os agendamentos, incluindo seus pagamentos.
   */
  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['payments', 'doctor', 'patient'], // Inclui as relações necessárias
    });
  }

  /**
   * Retorna um agendamento específico pelo ID, incluindo seus pagamentos.
   */
  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['payments', 'doctor', 'patient'], // Inclui as relações necessárias
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  /**
   * Cria um novo agendamento e associa os pagamentos.
   */
  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const { patientId, doctorId, payments, ...rest } = createAppointmentDto;

    // Verifica se o paciente existe
    const patient = await this.userRepository.findOne({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    // Verifica se o médico existe
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
    }

    // Cria o agendamento
    const appointment = this.appointmentRepository.create({
      ...rest,
      patient,
      doctor,
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);

    // Adiciona os pagamentos ao agendamento, se existirem
    if (payments && payments.length > 0) {
      const paymentEntities = payments.map((payment) =>
        this.paymentRepository.create({
          ...payment,
          appointment: savedAppointment,
        }),
      );

      await this.paymentRepository.save(paymentEntities);
    }

    return this.findOne(savedAppointment.id); // Retorna o agendamento completo, incluindo os pagamentos
  }

  /**
   * Atualiza os dados de um agendamento e seus pagamentos.
   */
  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const { payments, ...rest } = updateAppointmentDto;

    // Verifica se o agendamento existe
    const appointment = await this.findOne(id);
    Object.assign(appointment, rest);

    const updatedAppointment =
      await this.appointmentRepository.save(appointment);

    // Atualiza os pagamentos associados
    if (payments && payments.length > 0) {
      // Remove os pagamentos antigos
      await this.paymentRepository.delete({ appointment: updatedAppointment });

      // Adiciona os novos pagamentos
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

  /**
   * Remove um agendamento e seus pagamentos associados.
   */
  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);

    // Remove os pagamentos associados antes de remover o agendamento
    await this.paymentRepository.delete({ appointment });

    await this.appointmentRepository.remove(appointment);
  }

  /**
   * Retorna os pagamentos associados a um agendamento específico.
   */
  async findPaymentsByAppointment(appointmentId: number): Promise<Payment[]> {
    const appointment = await this.findOne(appointmentId);

    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${appointmentId} not found`,
      );
    }

    return this.paymentRepository.find({
      where: { appointment: { id: appointmentId } },
    });
  }
}
