import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentDto {
  @IsNotEmpty()
  @IsString()
  method: string; // Forma de pagamento (ex: cash, card)

  @IsNotEmpty()
  amount: number; // Valor pago
}

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
