import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Gera um token JWT para o usuário autenticado.
   */
  async login(user: User): Promise<{ accessToken: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  /**
   * Valida o usuário no processo de autenticação.
   */
  async validateUser(loginDto: LoginDto, user: User): Promise<User> {
    if (user && user.password === loginDto.password) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
