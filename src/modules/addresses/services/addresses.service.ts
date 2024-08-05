import {
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { Address } from '@prisma/client';
import { IAddressesRepository } from '../repositories/IAdressesRepository';
import { CreateAddressDto, UpdateAddressesDto } from '../dtos/adressesDTO';
import { IUsersRepository } from '@modules/users/repositories/IUsers-repository';
  
  @Injectable()
  export class AddressService {
    constructor(
        private readonly adressesRepository: IAddressesRepository,
        private readonly usersRepository: IUsersRepository
    ) {}
  
    async create(createAddressDto: CreateAddressDto): Promise<Address> {
      const userExist = await this.usersRepository.findById(createAddressDto.userId)
      if(!userExist) throw new NotFoundException('usuário não existe');

      const addressesExist = await this.adressesRepository.create(createAddressDto)
      return addressesExist;
    }
  
    async find(id: string): Promise<Address> {
        const address = await this.adressesRepository.findByUserId(id)
        return address;
    }
  
    async update(id: string, updateUserDto: UpdateAddressesDto): Promise<Address> {
        const addressExist = await this.adressesRepository.findById(id)
        if (!addressExist) throw new NotFoundException('endereço não existe');

        if(updateUserDto.city) addressExist.city = updateUserDto.city;
        if(updateUserDto.country) addressExist.country = updateUserDto.country;
        if(updateUserDto.state) addressExist.state = updateUserDto.state;
        if(updateUserDto.street) addressExist.street = updateUserDto.street;
        if(updateUserDto.zipCode) addressExist.zipCode = updateUserDto.zipCode;

        const address = await this.adressesRepository.update(id, addressExist);
        return address;
    }
  
    async remove(id: string): Promise<void> {
        await this.adressesRepository.deleteById(id);
    }
  }