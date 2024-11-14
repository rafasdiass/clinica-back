import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Exam } from '../../exams/entities/exam.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' }) // Pode ser 'admin', 'doctor', 'employee', 'patient'
  role: string;

  @Column({ default: true })
  isActive: boolean;

  // Relação com pacientes (caso seja um médico)
  @OneToMany(() => Patient, (patient) => patient.user)
  patients: Patient[];

  // Relação com agendamentos (caso seja um paciente)
  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  // Relação com exames (caso seja um paciente)
  @OneToMany(() => Exam, (exam) => exam.patient)
  exams: Exam[];

  // Permissões adicionais em formato JSON
  @Column({ type: 'json', nullable: true })
  permissions: Record<string, boolean>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
