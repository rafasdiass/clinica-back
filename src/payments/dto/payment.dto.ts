import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PaymentDto {
  @IsString()
  @IsNotEmpty()
  method: string; // Forma de pagamento (ex: cash, card, insurance)

  @IsNumber()
  @Min(0)
  amount: number; // Valor pago
}
