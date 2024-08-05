import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { CampaignsService } from '../services/campaigns.service';
import { CreateCampaignDto, UpdateCampaignDto } from '../dtos/campaignsDTO';
import { AuthGuard } from '@modules/auth/providers/auth.guard';
import { RoleUser } from '@modules/auth/role.decorator';

@Controller('/campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @UseGuards(AuthGuard)
  @RoleUser('admin')
  @Post()
  async create(@Body() createCampaignDto: CreateCampaignDto) {
    await this.campaignsService.create(createCampaignDto);
    return { statusCode: 201, message: 'Campanha criada com sucesso' };
  }

  @UseGuards(AuthGuard)
  @RoleUser('client')
  @Get()
  async findAll() {
    return this.campaignsService.findAll();
  }

  @UseGuards(AuthGuard)
  @RoleUser('client')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @RoleUser('admin')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    await this.campaignsService.update(id, updateCampaignDto);
    return { statusCode: 200, message: 'Campanha atualizada com sucesso' };
  }

  @UseGuards(AuthGuard)
  @RoleUser('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.campaignsService.remove(id);
    return { statusCode: 200, message: 'Campanha deletada com sucesso' };
  }
}
