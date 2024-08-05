import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { usersRepositoryProvider } from './repositories/users-repository.provider';
import { addressesRepositoryProvider } from '@modules/addresses/repositories/addresses-repositoy.provider';

@Module({
  controllers: [UsersController],
  providers: [UsersService, usersRepositoryProvider, addressesRepositoryProvider],
  exports: [usersRepositoryProvider]
})
export class UsersModule {}
