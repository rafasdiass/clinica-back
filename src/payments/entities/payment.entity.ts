import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  method: string; // Forma de pagamento: 'cash', 'credit_card', 'debit_card', etc.

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // Valor do pagamento

  @ManyToOne(() => Appointment, (appointment) => appointment.payments)
  appointment: Appointment;

  @CreateDateColumn()
  paidAt: Date; // Data do pagamento
}
