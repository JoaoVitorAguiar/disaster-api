import { JwtModuleOptions } from '@nestjs/jwt';
import { configuration } from './configuration';

const config = configuration();

export const jwtConfig: JwtModuleOptions = {
  secret: config.jwtSecret,
  global: true,
  signOptions: {
    expiresIn: '7d',
  },
};
