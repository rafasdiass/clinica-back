import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  day: string; // Exemplo: '2024-11-13'

  @IsString()
  @IsNotEmpty()
  startTime: string; // Exemplo: '09:00'

  @IsString()
  @IsNotEmpty()
  endTime: string; // Exemplo: '09:30'

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @IsNotEmpty()
  doctorId: number; // ID do médico
}
