import { User } from '@prisma/client';
import { CreateUserDto } from '../dtos/userDTO';

export abstract class IUsersRepository {
  abstract create(user: Omit<CreateUserDto, 'address'>): Promise<User>;
  abstract update(id: string, user: Partial<User>): Promise<User>;
  abstract findAll(): Promise<User[]>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByCepAdress(cep: string): Promise<User[]>;
  abstract findByEmailORCpf(email: string, cpf?: string): Promise<User | null>;
  abstract deleteById(id: string): Promise<void>;
}
