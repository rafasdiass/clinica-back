import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentDto } from 'src/payments/dto/payment.dto';

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDto)
  payments?: PaymentDto[];
}
