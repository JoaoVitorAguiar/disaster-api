import { Module } from '@nestjs/common';
import { CampaignsController } from './controllers/campaigns.controller';
import { CampaignsService } from './services/campaigns.service';
import { campaignsRepositoryProvider } from './repositories/campaigns.repository.providers';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, campaignsRepositoryProvider],
})
export class CampaignsModule {}
