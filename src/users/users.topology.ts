import { ConfigModule, ConfigService } from '@nestjs/config';

export const QUEUE = {
  CREATE_CAMPAIGN: 'create-campaign',
  UPDATE_CAMPAIGN: 'update-campaign'
};
export const ROUTE = {
  CREATE_CAMPAIGN: 'create-campaign',
  UPDATE_CAMPAIGN: 'update-campaign'
};

export const AUTHORIZATION_RPC_EXCHANGE_NAME = 'auth-service';

export const UsersTopology = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    exchanges: [
      {
        name: AUTHORIZATION_RPC_EXCHANGE_NAME,
        type: 'direct',
      },
    ],
    uri: configService.get<string>('RMQ_URL'),
    enableControllerDiscovery: true,
  }),
  inject: [ConfigService],
};