import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExamType } from './exam-type.entity';
import { User } from '../../users/entities/user.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExamType, { eager: true })
  type: ExamType;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  result: string;

  @Column({ nullable: true })
  resultImage: string;

  @ManyToOne(() => Doctor, { nullable: true, eager: true })
  doctor: Doctor;

  @Column({ nullable: true })
  externalDoctorName: string;

  @Column({ nullable: true })
  externalDoctorCrm: string;

  @ManyToOne(() => User, { eager: true })
  patient: User;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
