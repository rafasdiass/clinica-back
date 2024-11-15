import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  /**
   * Retorna todos os médicos cadastrados.
   */
  async findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find();
  }

  /**
   * Retorna um médico pelo ID.
   * @param id - ID do médico.
   */
  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({ where: { id } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  /**
   * Cria um novo médico.
   * @param createDoctorDto - Dados do médico a ser criado.
   */
  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctor = this.doctorRepository.create(createDoctorDto);
    return this.doctorRepository.save(doctor);
  }

  /**
   * Atualiza os dados de um médico existente.
   * @param id - ID do médico.
   * @param updateDoctorDto - Dados atualizados do médico.
   */
  async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findOne(id);
    Object.assign(doctor, updateDoctorDto);
    return this.doctorRepository.save(doctor);
  }

  /**
   * Remove um médico existente.
   * @param id - ID do médico.
   */
  async remove(id: number): Promise<void> {
    const doctor = await this.findOne(id);
    await this.doctorRepository.remove(doctor);
  }

  /**
   * Popula o banco de dados com médicos iniciais.
   */
  async seedDoctors(): Promise<void> {
    const initialDoctors = [
      {
        name: 'Andrea Brasil',
        crm: '7587',
        specialty: 'Oftalmologia',
        phone: '123456789',
        email: 'andrea.brasil@example.com',
      },
      {
        name: 'Henrique Guerra',
        crm: '7588',
        specialty: 'Oftalmologia',
        phone: '987654321',
        email: 'henrique.guerra@example.com',
      },
      {
        name: 'André Mont’alverne',
        crm: '13883',
        specialty: 'Glaucoma',
        phone: '456789123',
        email: 'andre.montalverne@example.com',
      },
      {
        name: 'Francine Leite',
        crm: '15646',
        specialty: 'Medicina do Tráfego',
        phone: '321654987',
        email: 'francine.leite@example.com',
      },
      {
        name: 'Carlos Eduardo',
        crm: '12463',
        specialty: 'Medicina do Tráfego',
        phone: '654987321',
        email: 'carlos.eduardo@example.com',
      },
    ];

    for (const doctor of initialDoctors) {
      const exists = await this.doctorRepository.findOne({
        where: { crm: doctor.crm },
      });

      if (!exists) {
        const newDoctor = this.doctorRepository.create(doctor);
        await this.doctorRepository.save(newDoctor);
      }
    }
  }
}
