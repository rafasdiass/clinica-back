import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DoctorsService } from './doctors/doctors.service';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

  const app = await NestFactory.create(AppModule);

  // Configurações globais
  app.setGlobalPrefix('api'); // Define um prefixo global para todas as rotas

  // Configuração de CORS (se necessário)
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Executa a população inicial de médicos
  const doctorsService = app.get(DoctorsService);
  await doctorsService.seedDoctors();

  const port = process.env.PORT || 3000;
  console.log(`Application is running on: http://localhost:${port}`);
  await app.listen(port);
}

bootstrap();
