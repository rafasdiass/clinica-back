import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Exam } from '../../exams/entities/exam.entity';
import { Patient } from '../../patients/entities/patient.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  crm: string;

  @Column()
  specialty: string;

  @Column({ nullable: true })
  phone: string; // Telefone do médico

  @Column({ nullable: true })
  email: string; // Email do médico

  @Column({ default: true })
  isActive: boolean; // Status ativo/inativo do médico

  // Relação com a tabela de pacientes
  @OneToMany(() => Patient, (patient) => patient.doctor)
  patients: Patient[];

  // Relação com a tabela de agendas
  @OneToMany(() => Schedule, (schedule) => schedule.doctor)
  schedules: Schedule[];

  // Relação com a tabela de agendamentos
  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  // Relação com a tabela de exames
  @OneToMany(() => Exam, (exam) => exam.doctor)
  exams: Exam[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
