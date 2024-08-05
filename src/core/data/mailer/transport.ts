import { configuration } from '@core/infra/config/configuration';
import * as nodemailer from 'nodemailer';

const config = configuration();

export const transport =
  config.nodeEnv === 'development'
    ? nodemailer.createTestAccount().then((testAccount) => ({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      }))
    : {
        host: config.mail.host,
        secure: config.mail.secure,
        port: config.mail.port,
        auth: {
          user: config.mail.address,
          pass: config.mail.pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      };
