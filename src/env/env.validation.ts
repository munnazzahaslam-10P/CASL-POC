import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  @IsUrl({
    require_tld: false,
    protocols: ['postgresql'],
  })
  DATABASE_URL: string;

  @IsString()
  @IsUrl({
    require_tld: false,
    protocols: ['amqp'],
  })
  RMQ_URL: string;

  @IsString()
  RMQ_AUTHORIZATION_SERVICE_QUEUE: string;
  @IsBoolean()
  RMQ_AUTHORIZATION_SERVICE_QUEUE_DURABLE: boolean;
  @IsBoolean()
  RMQ_AUTHORIZATION_SERVICE_PRODUCER_QUEUE_NO_ACK: boolean;
  @IsBoolean()
  RMQ_AUTHORIZATION_SERVICE_CONSUMER_QUEUE_NO_ACK: boolean;

  @IsString()
  RMQ_AUTHORIZATION_EVENTS_QUEUE: string;
  @IsBoolean()
  RMQ_AUTHORIZATION_EVENTS_QUEUE_DURABLE: boolean;
  @IsBoolean()
  RMQ_AUTHORIZATION_EVENTS_PRODUCER_QUEUE_NO_ACK: boolean;
  @IsBoolean()
  RMQ_AUTHORIZATION_EVENTS_CONSUMER_QUEUE_NO_ACK: boolean;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
