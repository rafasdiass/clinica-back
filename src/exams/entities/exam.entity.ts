import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Nome do exame

  @Column({ nullable: true })
  description: string; // Descrição do exame

  @Column({ nullable: true })
  result: string; // Resultado do exame

  @Column({ nullable: true })
  resultImage: string; // URL da imagem do exame

  // Médico interno
  @ManyToOne(() => Doctor, (doctor) => doctor.exams, {
    nullable: true,
    eager: true,
  })
  doctor: Doctor;

  // Médico externo
  @Column({ nullable: true })
  externalDoctorName: string; // Nome do médico externo

  @Column({ nullable: true })
  externalDoctorCrm: string; // CRM do médico externo

  // Paciente que solicitou o exame
  @ManyToOne(() => User, (user) => user.exams, { eager: true })
  patient: User;

  @Column({ default: 'pending' }) // Status do exame (ex: pending, completed)
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
