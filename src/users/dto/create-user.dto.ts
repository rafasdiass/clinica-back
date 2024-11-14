import {
  IsString,
  IsEmail,
  IsOptional,
  IsIn,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required and must be valid' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsOptional()
  @IsIn(['admin', 'doctor', 'employee', 'patient'], {
    message: 'Role must be one of: admin, doctor, employee, patient',
  })
  role?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean; // Default is true
}
