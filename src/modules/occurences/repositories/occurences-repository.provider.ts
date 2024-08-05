import { Provider } from '@nestjs/common';
import { IOccurrencesRepository } from './occurences-repository.abstract';
import { OccurrencesRepository } from './implementations/occurences.repository';

export const occurencesRepositoryProvider: Provider = {
  provide: IOccurrencesRepository,
  useClass: OccurrencesRepository,
};
