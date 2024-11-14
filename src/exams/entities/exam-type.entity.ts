import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('exam_types')
export class ExamType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
}
