import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  method: string; // Método de pagamento (ex: cartão, dinheiro, plano de saúde)

  @IsNumber()
  @Min(0)
  amount: number; // Valor do pagamento

  @IsNotEmpty()
  @IsNumber()
  appointmentId: number; // ID do agendamento relacionado
}
