import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async findAll(user: User): Promise<Patient[]> {
    if (user.role === 'admin') {
      return this.patientRepository.find();
    }
    if (user.role === 'doctor') {
      return this.patientRepository.find({ where: { doctor: user } });
    }
    throw new ForbiddenException('You do not have access to this resource');
  }

  async findOne(id: number, user: User): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    if (user.role !== 'admin' && patient.doctor.id !== user.id) {
      throw new ForbiddenException(
        'Access denied: You are not the assigned doctor',
      );
    }
    return patient;
  }

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create(createPatientDto);
    return this.patientRepository.save(patient);
  }

  async update(
    id: number,
    updatePatientDto: UpdatePatientDto,
    user: User,
  ): Promise<Patient> {
    const patient = await this.findOne(id, user);
    Object.assign(patient, updatePatientDto);
    return this.patientRepository.save(patient);
  }

  async remove(id: number, user: User): Promise<void> {
    const patient = await this.findOne(id, user);
    await this.patientRepository.remove(patient);
  }
}
