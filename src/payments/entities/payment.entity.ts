import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  method: string; // Exemplo: 'cash', 'credit_card', 'insurance'

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Appointment, (appointment) => appointment.payments, {
    eager: true,
  })
  appointment: Appointment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
