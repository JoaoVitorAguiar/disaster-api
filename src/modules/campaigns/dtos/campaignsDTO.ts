import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
} from 'class-validator';
import { CampaignStatus } from '@prisma/client';

export class CreateCampaignDto {
  @IsNotEmpty({ message: 'Nome da campanha é obrigatório' })
  @IsString({ message: 'Nome da campanha deve ser uma string' })
  name: string;

  @IsNotEmpty({ message: 'Descrição da campanha é obrigatória' })
  @IsString({ message: 'Descrição da campanha deve ser uma string' })
  description: string;

  @IsNotEmpty({ message: 'Valor alvo da arrecadação é obrigatório' })
  @IsNumber({}, { message: 'Valor alvo deve ser um número' })
  goalAmount: number;

  @IsOptional()
  @IsNumber({}, { message: 'Valor já arrecadado deve ser um número' })
  raisedAmount?: number;

  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  @Type(() => Date)
  @IsDate({ message: 'Data de início deve ser uma data válida' })
  startDate: Date;

  @IsNotEmpty({ message: 'Data de término é obrigatória' })
  @Type(() => Date)
  @IsDate({ message: 'Data de término deve ser uma data válida' })
  endDate: Date;

  @IsNotEmpty({ message: 'Status da campanha é obrigatório' })
  @IsEnum(CampaignStatus, {
    message:
      'Status da campanha deve ser um dos seguintes valores: active, completed, pending, cancelled.',
  })
  status: CampaignStatus;

  @IsNotEmpty({ message: 'Latitude é obrigatória' })
  @IsNumber({}, { message: 'Latitude deve ser um número' })
  latitude: number;

  @IsNotEmpty({ message: 'Longitude é obrigatória' })
  @IsNumber({}, { message: 'Longitude deve ser um número' })
  longitude: number;

  @IsNotEmpty({ message: 'QR Code é obrigatório' })
  @IsString({ message: 'QR Code deve ser uma string' })
  qrCode: string;
}

export class UpdateCampaignDto {
  @IsOptional()
  @IsString({ message: 'Nome da campanha deve ser uma string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Descrição da campanha deve ser uma string' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Valor alvo deve ser um número' })
  goalAmount?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Valor já arrecadado deve ser um número' })
  raisedAmount?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Data de início deve ser uma data válida' })
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Data de término deve ser uma data válida' })
  endDate?: Date;

  @IsOptional()
  @IsEnum(CampaignStatus, {
    message:
      'Status da campanha deve ser um dos seguintes valores: active, completed, pending, cancelled.',
  })
  status?: CampaignStatus;

  @IsOptional()
  @IsNumber({}, { message: 'Latitude deve ser um número' })
  latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Longitude deve ser um número' })
  longitude?: number;

  @IsOptional()
  @IsString({ message: 'QR Code deve ser uma string' })
  qrCode?: string;
}
