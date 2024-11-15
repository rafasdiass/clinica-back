import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { Pricing } from './entities/pricing.entity.';

@Module({
  imports: [TypeOrmModule.forFeature([Pricing])], // Certifique-se de que a entidade Pricing está registrada aqui
  controllers: [PricingController],
  providers: [PricingService],
  exports: [PricingService], // Exporte o serviço para uso em outros módulos, se necessário
})
export class PricingModule {}
