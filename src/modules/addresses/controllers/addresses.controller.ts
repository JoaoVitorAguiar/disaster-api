import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
  } from '@nestjs/common';
import { CreateAddressDto, UpdateAddressesDto } from '../dtos/adressesDTO';
import { AddressService } from '../services/addresses.service';
import { AuthGuard } from '@modules/auth/providers/auth.guard';
import { RoleUser } from '@modules/auth/role.decorator';
  
  
  
  @Controller('/addresses')
  export class AddressesController {
    constructor(private readonly addressesService: AddressService) {}

    @UseGuards(AuthGuard)
    @RoleUser('client')
    @Post()
    async create(@Body() createUserDto: CreateAddressDto) {
      const user = await this.addressesService.create(createUserDto);
      return user;
    }
  
    @UseGuards(AuthGuard)
    @RoleUser('client')
    @Get(':id')
    async find(@Param('id') id: string) {
      return await this.addressesService.find(id);
    }
  
    @UseGuards(AuthGuard)
    @RoleUser('client')
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateAddressesDto) {

      return await this.addressesService.update(id, updateUserDto);
    }
  
    @UseGuards(AuthGuard)
    @RoleUser('client')
    @Delete(':id')
    async remove(@Param('id') id: string) {
      return await this.addressesService.remove(id);
    }
  }