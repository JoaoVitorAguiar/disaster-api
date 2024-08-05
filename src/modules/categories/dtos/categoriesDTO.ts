import { CategoryStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Nome da categoria é obrigatório' })
  @IsString({ message: 'Nome da categoria deve ser uma string' })
  name: string;

  @IsOptional()
  @IsEnum(CategoryStatus, {
    message: 'Status da categoria inválido',
  })
  status: CategoryStatus;
}

export class UpdateCategoryDto {
  @IsOptional({ message: 'Nome da categoria é obrigatório' })
  @IsString({ message: 'Nome da categoria deve ser uma string' })
  name: string;

  @IsOptional()
  @IsEnum(CategoryStatus, {
    message: 'Status da categoria inválido',
  })
  status: CategoryStatus;
}
