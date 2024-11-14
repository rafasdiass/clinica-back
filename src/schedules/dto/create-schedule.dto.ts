import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsDateString,
  Matches,
} from 'class-validator';

export class CreateScheduleDto {
  @IsDateString()
  @IsNotEmpty()
  date: string; // Data da agenda no formato ISO (YYYY-MM-DD)

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'startTime deve estar no formato HH:mm',
  })
  startTime: string; // Hora de início no formato 'HH:mm'

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'endTime deve estar no formato HH:mm',
  })
  endTime: string; // Hora de término no formato 'HH:mm'

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean; // Indica se o horário está bloqueado para consultas

  @IsNotEmpty()
  doctorId: number; // ID do médico associado à agenda
}
