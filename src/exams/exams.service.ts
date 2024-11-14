import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { ExamType } from './entities/exam-type.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { User } from '../users/entities/user.entity';
import { Doctor } from '../doctors/entities/doctor.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    @InjectRepository(ExamType)
    private readonly examTypeRepository: Repository<ExamType>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  /**
   * Cria um novo exame.
   * Valida o tipo de exame, o paciente e o médico (interno ou externo).
   */
  async create(createExamDto: CreateExamDto): Promise<Exam> {
    const {
      typeId,
      patientId,
      doctorId,
      externalDoctorName,
      externalDoctorCrm,
      ...rest
    } = createExamDto;

    const type = await this.examTypeRepository.findOne({
      where: { id: typeId },
    });
    if (!type) {
      throw new NotFoundException(`Exam Type with ID ${typeId} not found`);
    }

    const patient = await this.userRepository.findOne({
      where: { id: patientId, role: 'patient' },
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    let doctor = null;
    if (doctorId) {
      doctor = await this.doctorRepository.findOne({ where: { id: doctorId } });
      if (!doctor) {
        throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
      }
    } else if (!externalDoctorName || !externalDoctorCrm) {
      throw new ForbiddenException(
        'External doctor name and CRM must be provided if no internal doctor is selected',
      );
    }

    const exam = this.examRepository.create({
      type,
      patient,
      doctor,
      externalDoctorName,
      externalDoctorCrm,
      ...rest,
    });

    return this.examRepository.save(exam);
  }

  /**
   * Retorna todos os exames com base nas permissões do usuário.
   * Admin pode ver todos os exames, médicos veem exames de seus pacientes e pacientes veem apenas seus exames.
   */
  async findAll(user: User): Promise<Exam[]> {
    if (user.role === 'admin') {
      return this.examRepository.find({
        relations: ['type', 'patient', 'doctor'],
      });
    }

    if (user.role === 'doctor') {
      return this.examRepository.find({
        where: { doctor: { id: user.id } },
        relations: ['type', 'patient', 'doctor'],
      });
    }

    if (user.role === 'patient') {
      return this.examRepository.find({
        where: { patient: { id: user.id } },
        relations: ['type', 'patient', 'doctor'],
      });
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }

  /**
   * Atualiza um exame existente.
   * Apenas admins, médicos responsáveis ou pacientes podem realizar a atualização.
   */
  async update(
    id: number,
    updateExamDto: UpdateExamDto,
    user: User,
  ): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ['doctor', 'patient'],
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    // Valida permissões
    const isDoctor = user.role === 'doctor' && exam.doctor?.id === user.id;
    const isPatient = user.role === 'patient' && exam.patient.id === user.id;
    const isAdmin = user.role === 'admin';

    if (!isDoctor && !isPatient && !isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to update this exam',
      );
    }

    Object.assign(exam, updateExamDto);
    return this.examRepository.save(exam);
  }

  /**
   * Remove um exame existente.
   * Apenas admins, médicos responsáveis ou pacientes podem realizar a remoção.
   */
  async remove(id: number, user: User): Promise<void> {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ['doctor', 'patient'],
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    // Valida permissões
    const isDoctor = user.role === 'doctor' && exam.doctor?.id === user.id;
    const isPatient = user.role === 'patient' && exam.patient.id === user.id;
    const isAdmin = user.role === 'admin';

    if (!isDoctor && !isPatient && !isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to delete this exam',
      );
    }

    await this.examRepository.remove(exam);
  }

  /**
   * Retorna todos os tipos de exames disponíveis.
   */
  async findAllTypes(): Promise<ExamType[]> {
    return this.examTypeRepository.find();
  }

  /**
   * Popula a tabela de tipos de exames com dados iniciais.
   */
  async seedExamTypes(): Promise<void> {
    const types = [
      { name: 'Adaptação e treinamento para o uso de lentes de contato' },
      { name: 'Biometria Ultrassônica' },
      { name: 'Biometria Óptica' },
      { name: 'Campo Visual Computadorizado' },
      { name: 'Ceratoscopia / Topografia de córnea computadorizada' },
      { name: 'Curva Tensional Diária' },
      { name: 'Exame sob sedação' },
      { name: 'Fundoscopia' },
      { name: 'Fundoscopia sob Midríase' },
      { name: 'Gonioscopia' },
      { name: 'Indicação para o uso de Lentes de Contato' },
      { name: 'Mapeamento de Retina' },
      { name: 'Microscopia Especular de Córnea' },
      { name: 'Paquimetria' },
      { name: 'Retinografia' },
      { name: 'Teste da Visão de Cores' },
      { name: 'Teste da Motilidade Ocular' },
      { name: 'Teste de Schirmer' },
      { name: 'Teste Ortóptico' },
      { name: 'Teste de Sobrecarga Hídrica' },
      { name: 'Tomografia de Coerência Óptica - OCT' },
      { name: 'Tonometria' },
    ];

    for (const type of types) {
      const exists = await this.examTypeRepository.findOne({
        where: { name: type.name },
      });
      if (!exists) {
        await this.examTypeRepository.save(
          this.examTypeRepository.create(type),
        );
      }
    }
  }
}
