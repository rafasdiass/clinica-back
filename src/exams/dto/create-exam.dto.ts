import { IsNotEmpty, IsString, ValidateIf, IsNumber } from 'class-validator';

export class CreateExamDto {
  @IsNumber()
  @IsNotEmpty()
  typeId: number;

  @IsString()
  description?: string;

  @IsNotEmpty()
  patientId: number;

  @ValidateIf((o) => !o.externalDoctorName && !o.externalDoctorCrm)
  @IsNotEmpty({
    message: 'Doctor ID is required if external doctor is not provided',
  })
  doctorId?: number;

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
