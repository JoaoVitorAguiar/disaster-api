import { Module } from '@nestjs/common';
import { OccurencesController } from './controllers/occurences.controller';
import { OccurencesService } from './services/occurences.service';
import { occurencesRepositoryProvider } from './repositories/occurences-repository.provider';
import { usersRepositoryProvider } from '@modules/users/repositories/users-repository.provider';

@Module({
  controllers: [OccurencesController],
  providers: [OccurencesService, occurencesRepositoryProvider, usersRepositoryProvider],
})
export class OccurencesModule {}
