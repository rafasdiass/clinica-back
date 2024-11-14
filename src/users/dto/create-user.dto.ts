import {
  IsString,
  IsEmail,
  IsOptional,
  IsIn,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsIn(['admin', 'doctor', 'employee', 'patient'])
  role?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
