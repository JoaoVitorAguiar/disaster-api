import { Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { z as zod } from 'zod';

config();
export interface Config {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  databaseUrl: string;
  hashSecret: string;
  appUrl: string;
  frontEndUrl: string;
  storageDriver: 'google-cloud' | 'disk';
  jwtSecret: string;
  googleCloud: {
    projectId: string;
    storageBucketName: string;
    storageKey: string;
  };
  mail: {
    host: string;
    secure: boolean;
    port: number;
    name: string;
    address: string;
    pass: string;
  };
}

export const configuration = (): Config => {
  const logger = new Logger();

  const envSchema = zod.object({
    NODE_ENV: zod.enum(['development', 'production', 'test']),
    DATABASE_URL: zod.string().min(1),
    APP_URL: zod.string().url().min(1),
    FRONTEND_URL: zod.string().url().min(1),
    PORT: zod.string().min(1).regex(/^\d+$/).default('3000').transform(Number),
    JWT_SECRET: zod.string().min(1),

    GOOGLE_CLOUD_PROJECT_ID: zod.string().min(1),
    GOOGLE_CLOUD_STORAGE_BUCKET_NAME: zod.string().min(1),
    GOOGLE_CLOUD_STORAGE_KEY: zod.string().min(1),
    STORAGE_DRIVER: zod.enum(['disk', 'google-cloud']).default('disk'),

    MAIL_HOST: zod.string(),
    MAIL_SECURE: zod.union([zod.literal('true'), zod.literal('false')]),
    MAIL_PORT: zod.string().transform(Number),
    MAIL_NAME: zod.string(),
    MAIL_ADDRESS: zod.string(),
    MAIL_PASS: zod.string(),
  });

  const envData = envSchema.safeParse(process.env);

  if (!envData.success) {
    logger.error('Variáveis de ambiente inválidas');
    logger.error(envData.error);
    process.exit(1);
  }

  const { data } = envData;

  return {
    nodeEnv: data.NODE_ENV,
    port: data.PORT,
    appUrl: data.APP_URL,
    frontEndUrl: data.FRONTEND_URL,
    databaseUrl: data.DATABASE_URL,
    hashSecret: String(process.env.HASH_SECRET),
    jwtSecret: data.JWT_SECRET,
    googleCloud: {
      projectId: data.GOOGLE_CLOUD_PROJECT_ID,
      storageBucketName: data.GOOGLE_CLOUD_STORAGE_BUCKET_NAME,
      storageKey: data.GOOGLE_CLOUD_STORAGE_KEY,
    },
    storageDriver: data.STORAGE_DRIVER,
    mail: {
      host: data.MAIL_HOST,
      secure: data.MAIL_SECURE === 'true',
      port: data.MAIL_PORT,
      name: data.MAIL_NAME,
      address: data.MAIL_ADDRESS,
      pass: data.MAIL_PASS,
    },
  };
};
