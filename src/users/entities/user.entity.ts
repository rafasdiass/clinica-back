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

  @Column({ default: 'patient' }) // Pode ser 'admin', 'doctor', 'employee', 'patient'
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Patient, (patient) => patient.user)
  patients: Patient[];

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @OneToMany(() => Exam, (exam) => exam.patient)
  exams: Exam[];

  @Column({ type: 'json', nullable: true })
  permissions: Record<string, boolean>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
