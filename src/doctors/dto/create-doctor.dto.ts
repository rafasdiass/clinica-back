import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  crm: string; // Número de registro médico

  @IsString()
  @IsNotEmpty()
  specialty: string; // Exemplo: 'Cardiologia'

  @IsOptional()
  @IsString()
  phone?: string; // Telefone do médico
}
