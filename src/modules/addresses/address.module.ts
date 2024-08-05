import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { AuthService } from '@modules/auth/services/auth.service';
import { AddressesController } from './controllers/addresses.controller';
import { AddressService } from './services/addresses.service';
import { addressesRepositoryProvider } from './repositories/addresses-repositoy.provider';
import { usersRepositoryProvider } from '@modules/users/repositories/users-repository.provider';

@Module({
  controllers: [AddressesController],
  providers: [AddressService, addressesRepositoryProvider, usersRepositoryProvider],
  exports: [addressesRepositoryProvider]
})
export class AddressesModule {}