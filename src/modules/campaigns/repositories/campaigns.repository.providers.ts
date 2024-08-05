import { Provider } from '@nestjs/common';
import { CampaignsRepository } from './implementations/campaigns.repository';
import { ICampaignsRepository } from './campaigns-repository.abstract';

export const campaignsRepositoryProvider: Provider<ICampaignsRepository> = {
  provide: ICampaignsRepository,
  useClass: CampaignsRepository,
};
