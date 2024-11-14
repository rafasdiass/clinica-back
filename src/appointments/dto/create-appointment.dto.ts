import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  date: string; // Exemplo: '2024-11-15'

  @IsString()
  @IsNotEmpty()
  startTime: string; // Exemplo: '10:00'

  @IsString()
  @IsNotEmpty()
  endTime: string; // Exemplo: '10:30'

  @IsOptional()
  @IsIn(['pending', 'active', 'cancelled'])
  status?: string;

  @IsNotEmpty()
  patientId: number;

  @IsNotEmpty()
  doctorId: number;
}
