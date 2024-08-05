import { Provider } from '@nestjs/common';
import { IAddressesRepository } from './IAdressesRepository';
import { AdressesRepository } from './implementations/prisma-adresses-repository';


export const addressesRepositoryProvider: Provider<IAddressesRepository> = {
  provide: IAddressesRepository,
  useClass: AdressesRepository,
};