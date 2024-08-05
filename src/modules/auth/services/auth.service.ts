import { IUsersRepository } from '@modules/users/repositories/IUsers-repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { compare } from 'bcryptjs';
import { PayLoadData } from '../dtos/authDTO';
import { configuration } from '@core/infra/config/configuration';


const config = configuration();

interface CheckRoleOptions {
  email: string;
  roleName: Role;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, passwordUser: string): Promise<User> {
    const user = await this.usersRepository.findByEmailORCpf(email);
    if (!user) {
      throw new UnauthorizedException('usuario ou senha incorreta');
    }
    const isPasswordValid = await compare(passwordUser, user.password);
    console;
    if (!isPasswordValid) {
      throw new UnauthorizedException('usuario ou senha incorreta');
    }
    return user;
  }

  async login(payload: PayLoadData) {
    const payloadData = {
      id: payload.id.toString(),
      email: payload.email.toString(),
      roleName: payload.role,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: config.jwtSecret,
        expiresIn: '7d',
      }),
    };
  }
  decodeToken(token: string): PayLoadData {
    const payload = this.jwtService.decode<PayLoadData>(token);

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }

  async checkRole(options: CheckRoleOptions): Promise<void> {
    if (options.roleName === 'admin') {
      const admin = await this.usersRepository.findByEmailORCpf(options.email);
      if (!admin || admin.role !== 'admin')
        throw new UnauthorizedException('Não autorizado');
    }
  }
}
