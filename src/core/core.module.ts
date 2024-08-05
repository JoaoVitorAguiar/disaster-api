import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './data/prisma/prisma.service';
import { configuration } from './infra/config/configuration';
import { MulterModule } from '@nestjs/platform-express';
import { StorageProvider } from './data/storage';
import { FileService } from './infra/services/file.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigService } from './data/mailer/mailer-config.service';
import { EmailService } from './infra/services/email.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MulterModule.register({
      dest: '../../tmp',
    }),
    MailerModule.forRootAsync({
      useClass: MailerConfigService,
    }),
  ],
  providers: [
    PrismaService,
    StorageProvider,
    FileService,
    MailerConfigService,
    EmailService,
  ],
  exports: [
    PrismaService,
    StorageProvider,
    FileService,
    MailerConfigService,
    EmailService,
  ],
})
export class CoreModule {}
