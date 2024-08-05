import { Campaign } from '@prisma/client';
import { CreateCampaignDto, UpdateCampaignDto } from '../dtos/campaignsDTO';

export abstract class ICampaignsRepository {
  abstract create(data: CreateCampaignDto): Promise<Campaign>;
  abstract findAll(): Promise<Campaign[]>;
  abstract findByName(name: string): Promise<Campaign | null>;
  abstract findById(id: string): Promise<Campaign | null>;
  abstract update(id: string, data: UpdateCampaignDto): Promise<Campaign>;
  abstract delete(id: string): Promise<void>;
}
