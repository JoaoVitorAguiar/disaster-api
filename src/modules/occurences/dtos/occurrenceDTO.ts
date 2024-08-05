import { OccurrenceStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateOccurenceDto {
  @IsNotEmpty({ message: 'Nome da ocorrência é o obrigatório' })
  @IsString({ message: 'Nome inválido' })
  title: string;

  @IsNotEmpty({ message: 'Descrição da ocorrência é o obrigatório' })
  @IsString({ message: 'Descrição inválida' })
  description: string;

  @IsNotEmpty({ message: 'cep da ocorrência é o obrigatório' })
  @IsString({ message: 'cep inválido' })
  zipCode: string

  @IsNotEmpty({ message: 'Latitude é obrigatória' })
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @IsNotEmpty({ message: 'Longitude é obrigatória' })
  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  @IsUUID('4')
  categoryId: string;

  @IsOptional()
  files: Express.Multer.File[];
}

export class UpdateOccurenceDto {
  @IsOptional()
  @IsString({ message: 'Nome inválido' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Descrição inválida' })
  description: string;

  @IsOptional()
  @IsEnum(OccurrenceStatus)
  status: OccurrenceStatus;
  
}

export class CreateOccurenceRepositoryInput {
  @IsNotEmpty({ message: 'Nome da ocorrência é o obrigatório' })
  @IsString({ message: 'Nome inválido' })
  title: string;

  @IsNotEmpty({ message: 'Descrição da ocorrência é o obrigatório' })
  @IsString({ message: 'Descrição inválida' })
  description: string;

  @IsNotEmpty({ message: 'cep da ocorrência é o obrigatório' })
  @IsString({ message: 'cep inválido' })
  zipCode: string
  
  @IsNotEmpty({ message: 'Latitude é obrigatória' })
  @IsNumber()
  latitude: number;

  @IsNotEmpty({ message: 'Longitude é obrigatória' })
  @IsNumber()
  longitude: number;

  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  @IsUUID('4')
  userId: string;

  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  @IsUUID('4')
  categoryId: string;

  @IsArray()
  files: string[];
}
