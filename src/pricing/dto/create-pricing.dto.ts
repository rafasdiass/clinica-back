import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreatePricingDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @Min(0)
  price: number;
}
