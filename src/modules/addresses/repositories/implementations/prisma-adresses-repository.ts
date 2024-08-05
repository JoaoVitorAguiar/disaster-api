import { Injectable } from '@nestjs/common';
import { Address } from '@prisma/client';
import { IAddressesRepository } from '../IAdressesRepository';
import { CreateAddressDto } from '@modules/addresses/dtos/adressesDTO';
import { PrismaService } from '@core/data/prisma/prisma.service';
@Injectable()
export class AdressesRepository implements IAddressesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Address | null> {
    const address = await this.prisma.address.findUnique({ where: { id } });
    return address;
  }

  async create(adress: CreateAddressDto): Promise<Address> {
    const newAdress = await this.prisma.address.create({ data: adress });
    return newAdress;
  }
  async update(id: string, address: Partial<Address>): Promise<Address> {
    const userUpdate = await this.prisma.address.update({
      where: { id },
      data: address,
    });
    return userUpdate;
  }

  async findByUserId(userId: string): Promise<Address | null> {
    const address = await this.prisma.address.findFirst({ where: { userId } });
    return address;
  }
  async deleteById(id: string): Promise<void> {
    await this.prisma.address.delete({
      where: { id },
    });
  }
}
