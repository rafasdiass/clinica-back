import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  /**
   * Retorna todos os agendamentos.
   */
  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find({ relations: ['doctor'] });
  }

  /**
   * Retorna um agendamento específico pelo ID.
   */
  async findOne(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return schedule;
  }

  /**
   * Cria um novo agendamento com slots de 15 minutos.
   */
  async createWithSlots(
    createScheduleDto: CreateScheduleDto,
  ): Promise<Schedule[]> {
    const { doctorId, date, startTime, endTime } = createScheduleDto;

    // Verifica se o médico existe
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
    }

    // Valida os horários
    const start = this.parseTime(startTime);
    const end = this.parseTime(endTime);
    if (end <= start) {
      throw new ConflictException('End time must be after start time');
    }

    // Gera os slots de 15 minutos
    const timeSlots = this.generateTimeSlots(start, end);

    // Cria as entradas na agenda
    const schedules = timeSlots.map((slot) => {
      return this.scheduleRepository.create({
        doctor,
        date,
        startTime: slot.start,
        endTime: slot.end,
      });
    });

    return this.scheduleRepository.save(schedules);
  }

  /**
   * Atualiza um agendamento.
   */
  async update(
    id: number,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    const schedule = await this.findOne(id);
    Object.assign(schedule, updateScheduleDto);
    return this.scheduleRepository.save(schedule);
  }

  /**
   * Remove um agendamento.
   */
  async remove(id: number): Promise<void> {
    const schedule = await this.findOne(id);
    await this.scheduleRepository.remove(schedule);
  }

  /**
   * Gera slots de 15 minutos.
   */
  private generateTimeSlots(
    start: number,
    end: number,
  ): { start: string; end: string }[] {
    const slots = [];
    let current = start;

    while (current < end) {
      const next = current + 15; // Incrementa 15 minutos
      slots.push({
        start: this.formatTime(current),
        end: this.formatTime(next),
      });
      current = next;
    }

    return slots;
  }

  /**
   * Converte horário no formato HH:MM para minutos.
   */
  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Converte minutos para o formato HH:MM.
   */
  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}
