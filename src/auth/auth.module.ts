import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule, // Para acesso às variáveis do .env
    PassportModule, // Para configuração de autenticação
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Secret do .env
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') }, // Expiração do token
      }),
    }),
    UsersModule, // Importa o módulo de usuários para acessar UsersService
  ],
  providers: [AuthService, JwtStrategy], // Serviços necessários para autenticação
  controllers: [AuthController], // Controlador de autenticação
})
export class AuthModule {}
