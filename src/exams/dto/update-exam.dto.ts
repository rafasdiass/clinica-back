import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsIn } from 'class-validator';
import { CreateExamDto } from './create-exam.dto';

export class UpdateExamDto extends PartialType(CreateExamDto) {
  @IsOptional()
  @IsString()
  result?: string;

  @IsOptional()
  @IsString()
  resultImage?: string;

  @IsOptional()
  @IsIn(['pending', 'completed', 'cancelled'])
  status?: string;
}
