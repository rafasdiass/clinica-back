import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  patientId: number; // Paciente que solicitou o exame

  // Caso seja um médico interno
  @ValidateIf((o) => !o.externalDoctorName && !o.externalDoctorCrm)
  @IsNotEmpty({
    message: 'Doctor ID is required if external doctor is not provided',
  })
  doctorId?: number;

  // Caso seja um médico externo
  @ValidateIf((o) => !o.doctorId)
  @IsNotEmpty({
    message:
      'External doctor name is required if internal doctor is not provided',
  })
  @IsString()
  externalDoctorName?: string;

  @ValidateIf((o) => !o.doctorId)
  @IsNotEmpty({
    message:
      'External doctor CRM is required if internal doctor is not provided',
  })
  @IsString()
  externalDoctorCrm?: string;
}
