import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsString, IsEmail, IsEnum, IsNotEmpty, isObject, ValidateNested, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';
import { CreateAddressDto } from '@modules/addresses/dtos/adressesDTO';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString({ message: 'Nome inválido' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'email é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'senha é obrigatória' })
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role;

  @IsString()
  @IsNotEmpty({ message: 'Cpf é obrigatório' })
  cpf: string;

  @ValidateNested()
  @Type(() => OmitType(CreateAddressDto, ['userId']))
  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  address: CreateAddressDto;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
