import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { User } from '../users/entities/user.entity';
import { Doctor } from '../doctors/entities/doctor.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  /**
   * Retorna todos os exames cadastrados.
   */
  async findAll(): Promise<Exam[]> {
    return this.examRepository.find();
  }

  /**
   * Retorna um exame específico se o usuário tiver permissão de acesso.
   */
  async findOne(id: number, user: User): Promise<Exam> {
    const exam = await this.examRepository.findOne({ where: { id } });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    // Verifica se o usuário tem permissão de acesso
    const hasPermission =
      exam.patient.id === user.id ||
      (exam.doctor && exam.doctor.id === user.id) ||
      user.role === 'admin';

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to access this exam',
      );
    }

    return exam;
  }

  /**
   * Cria um novo exame com médico interno ou externo vinculado.
   */
  async create(createExamDto: CreateExamDto): Promise<Exam> {
    const {
      patientId,
      doctorId,
      externalDoctorName,
      externalDoctorCrm,
      ...rest
    } = createExamDto;

    // Verifica se o paciente existe
    const patient = await this.userRepository.findOne({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    let doctor = null;

    // Caso tenha médico interno, verifica se existe
    if (doctorId) {
      doctor = await this.doctorRepository.findOne({ where: { id: doctorId } });
      if (!doctor) {
        throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
      }
    } else {
      // Verifica se médico externo foi informado corretamente
      if (!externalDoctorName || !externalDoctorCrm) {
        throw new ForbiddenException(
          'External doctor name and CRM must be provided if no internal doctor is selected',
        );
      }
    }

    // Cria o exame
    const exam = this.examRepository.create({
      ...rest,
      patient,
      doctor,
      externalDoctorName,
      externalDoctorCrm,
    });

    return this.examRepository.save(exam);
  }

  /**
   * Atualiza os dados de um exame existente.
   */
  async update(
    id: number,
    updateExamDto: UpdateExamDto,
    user: User,
  ): Promise<Exam> {
    const exam = await this.findOne(id, user);

    // Atualiza somente os campos permitidos
    Object.assign(exam, updateExamDto);

    return this.examRepository.save(exam);
  }

  /**
   * Remove um exame, verificando se o usuário tem permissão para isso.
   */
  async remove(id: number, user: User): Promise<void> {
    const exam = await this.findOne(id, user);

    await this.examRepository.remove(exam);
  }
}
