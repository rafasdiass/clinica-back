import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(user: User): Promise<{ accessToken: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (user && user.password === loginDto.password) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}

