import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.schedules, { eager: true })
  doctor: Doctor;

  @Column()
  date: string; // Data da agenda no formato YYYY-MM-DD

  @Column()
  startTime: string; // Hora de início (HH:mm)

  @Column()
  endTime: string; // Hora de término (HH:mm)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
