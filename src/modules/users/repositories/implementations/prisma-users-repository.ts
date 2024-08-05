import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../IUsers-repository';
import { CreateUserDto } from '@modules/users/dtos/userDTO';
import { User } from '@prisma/client';
import { PrismaService } from '@core/data/prisma/prisma.service';
@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByCepAdress(cep: string): Promise<User[]> {
    const usersWithSpecificZipCode = await this.prisma.user.findMany({
      where: {
        addresses: {
          some: {
            zipCode: cep,
          },
        },
      },
      include: {
        addresses: true, 
      },
    });
    return usersWithSpecificZipCode
  }

  async create(user: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({ data: user });
    return newUser;
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const userUpdate = await this.prisma.user.update({
      where: { id },
      data: user,
    });
    return userUpdate;
  }

  async findAll() {
    const users = this.prisma.user.findMany();
    return users;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
  }

  async findByEmailORCpf(
    email: string,
    cpfUser?: string,
  ): Promise<User | null> {
    const cpf = cpfUser || '';
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { cpf }],
      },
    });
    return user;
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
