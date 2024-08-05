import { Provider } from '@nestjs/common';
import { UsersRepository } from './implementations/prisma-users-repository';
import { IUsersRepository } from './IUsers-repository';

export const usersRepositoryProvider: Provider<IUsersRepository> = {
  provide: IUsersRepository,
  useClass: UsersRepository,
};
