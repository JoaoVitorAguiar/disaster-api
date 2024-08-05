import { Injectable } from '@nestjs/common';
import { ICampaignsRepository } from '../campaigns-repository.abstract';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
} from '@modules/campaigns/dtos/campaignsDTO';
import { Campaign } from '@prisma/client';
import { PrismaService } from '@core/data/prisma/prisma.service';

@Injectable()
export class CampaignsRepository implements ICampaignsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCampaignDto): Promise<Campaign> {
    const newCampaign = await this.prisma.campaign.create({ data });
    return newCampaign;
  }

  async update(id: string, data: UpdateCampaignDto): Promise<Campaign> {
    const updatedCampaign = await this.prisma.campaign.update({
      where: { id },
      data,
    });
    return updatedCampaign;
  }

  async findAll(): Promise<Campaign[]> {
    const campaigns = await this.prisma.campaign.findMany();
    return campaigns;
  }

  async findByName(name: string): Promise<Campaign | null> {
    const campaign = await this.prisma.campaign.findFirst({
      where: { name },
    });
    return campaign;
  }

  async findById(id: string): Promise<Campaign | null> {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    return campaign;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.campaign.delete({
      where: { id },
    });
    return;
  }
}
