import { Address } from '@prisma/client';
import { CreateAddressDto } from '../dtos/adressesDTO';

export abstract class IAddressesRepository {
  abstract create(address: CreateAddressDto): Promise<Address>;
  abstract update(id: string, address: Partial<Address>): Promise<Address>;
  abstract findById(id: string): Promise<Address | null>;
  abstract findByUserId(userId: string): Promise<Address | null>;
  abstract deleteById(id: string): Promise<void>;
}