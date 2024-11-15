import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pricing')
export class Pricing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  type: string; // Tipo de pagamento (particular, plano de saúde)

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // Valor do tipo de pagamento

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
