import { Provider } from '@nestjs/common';

import { GoogleCloudStorage } from './google-cloud.storage';
import { Storage } from './storage';
import { ConfigService } from '@nestjs/config';
import { Config } from '@core/infra/config/configuration';
import { LocalStorage } from './local.storage';

const storageDriver = new ConfigService().get<Config['storageDriver']>(
  'storageDriver',
);

const storageProvider =
  storageDriver === 'google-cloud' ? GoogleCloudStorage : LocalStorage;

export const StorageProvider: Provider<Storage> = {
  provide: Storage,
  useClass: storageProvider,
};

export * from './storage';
