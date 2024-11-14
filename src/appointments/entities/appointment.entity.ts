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

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string; // Exemplo: '2024-11-15'

  @Column()
  startTime: string; // Exemplo: '10:00'

  @Column()
  endTime: string; // Exemplo: '10:30'

  @Column({ default: 'pending' }) // Pode ser 'pending', 'active', 'cancelled'
  status: string;

  @ManyToOne(() => User, (user) => user.appointments, { eager: true })
  patient: User;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, { eager: true })
  doctor: Doctor;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
