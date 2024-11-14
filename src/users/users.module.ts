import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Registra a entidade User no TypeORM
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exporta UsersService para ser usado em outros módulos
})
export class UsersModule {}
