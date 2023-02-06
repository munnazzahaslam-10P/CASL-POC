import { envFilePath } from './env.file-path';
import { validate } from './env.validation';
import { ConfigModuleOptions } from '@nestjs/config';

export const configModuleOptions: ConfigModuleOptions = {
  cache: true,
  envFilePath,
  validate,
};
