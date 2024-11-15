import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Appointment } from '../appointments/entities/appointment.entity';

@Injectable()
export class PaymentsService {
  private readonly paymentRepository: Repository<Payment>;
  private readonly appointmentRepository: Repository<Appointment>;

  constructor(
    @Inject('PAYMENT_REPOSITORY')
    paymentRepository: Repository<Payment>,
    @Inject('APPOINTMENT_REPOSITORY')
    appointmentRepository: Repository<Appointment>,
  ) {
    this.paymentRepository = paymentRepository;
    this.appointmentRepository = appointmentRepository;
  }

  /**
   * Cria um novo pagamento e associa ao agendamento.
   */
  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { appointmentId, ...paymentData } = createPaymentDto;

    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });
    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${appointmentId} not found`,
      );
    }

    const payment = this.paymentRepository.create({
      ...paymentData,
      appointment,
    });

    return this.paymentRepository.save(payment);
  }

  /**
   * Retorna todos os pagamentos com seus agendamentos.
   */
  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({ relations: ['appointment'] });
  }

  /**
   * Retorna um pagamento específico.
   */
  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['appointment'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  /**
   * Atualiza os dados de um pagamento existente.
   */
  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.findOne(id);

    Object.assign(payment, updatePaymentDto);

    return this.paymentRepository.save(payment);
  }

  /**
   * Remove um pagamento específico.
   */
  async remove(id: number): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepository.remove(payment);
  }

  /**
   * Retorna os pagamentos associados a um agendamento.
   */
  async findByAppointment(appointmentId: number): Promise<Payment[]> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${appointmentId} not found`,
      );
    }

    return this.paymentRepository.find({
      where: { appointment },
    });
  }
}
