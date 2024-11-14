import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Retorna todos os usuários.
   * Funcionários podem ter acesso limitado aos dados.
   */
  async findAll(requestingUser: User): Promise<User[]> {
    if (requestingUser.role === 'admin') {
      return this.userRepository.find();
    }

    if (requestingUser.role === 'employee') {
      // Funcionários só podem visualizar pacientes e seus dados básicos
      return this.userRepository.find({
        where: { role: 'patient' },
        select: ['id', 'email', 'isActive', 'createdAt', 'updatedAt'],
      });
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }

  /**
   * Retorna os dados de um usuário pelo ID.
   */
  async findOne(id: number, requestingUser: User): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (requestingUser.role === 'admin' || requestingUser.id === user.id) {
      return user; // Admins podem acessar qualquer usuário, e usuários podem acessar seus próprios dados
    }

    if (requestingUser.role === 'employee' && user.role === 'patient') {
      // Funcionários podem acessar apenas dados básicos de pacientes
      return this.userRepository.findOne({
        where: { id, role: 'patient' },
        select: ['id', 'email', 'isActive', 'createdAt', 'updatedAt'],
      });
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }

  /**
   * Retorna um usuário pelo e-mail.
   * Usado no processo de autenticação.
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  /**
   * Cria um novo usuário.
   */
  async create(
    createUserDto: CreateUserDto,
    requestingUser: User,
  ): Promise<User> {
    if (
      requestingUser.role === 'employee' &&
      createUserDto.role !== 'patient'
    ) {
      throw new ForbiddenException(
        'Employees can only create patient accounts',
      );
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  /**
   * Atualiza os dados de um usuário.
   */
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    requestingUser: User,
  ): Promise<User> {
    const user = await this.findOne(id, requestingUser);

    if (requestingUser.role === 'patient' && requestingUser.id !== user.id) {
      throw new ForbiddenException('Patients can only update their own data');
    }

    if (requestingUser.role === 'employee' && user.role !== 'patient') {
      throw new ForbiddenException('Employees can only update patient data');
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  /**
   * Remove um usuário pelo ID.
   */
  async remove(id: number, requestingUser: User): Promise<void> {
    if (requestingUser.role !== 'admin') {
      throw new ForbiddenException('Only admins can remove users');
    }

    const user = await this.findOne(id, requestingUser);
    await this.userRepository.remove(user);
  }
}
