import { join, resolve } from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { transport } from './transport';
import { Config } from '@core/infra/config/configuration';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
  private logger = new Logger(MailerConfigService.name);

  constructor(private configService: ConfigService<Config>) {}

  async createMailerOptions(): Promise<MailerOptions> {
    const env = this.configService.getOrThrow<Config['nodeEnv']>('nodeEnv');
    const isProductionEnv = env === 'production';
    const mailConfig = this.configService.getOrThrow<Config['mail']>('mail');

    return {
      transport: await transport,
      defaults: {
        from: `"${mailConfig.name}" <${mailConfig.address}>`,
      },
      preview: !isProductionEnv,
      template: {
        dir: resolve(join(__dirname, '..', '..', '..', '..','..',  'templates')),
        adapter: new HandlebarsAdapter(undefined, {
          inlineCssEnabled: true,
        }),
        options: {
          strict: true,
        },
      },
    };
  }
}
