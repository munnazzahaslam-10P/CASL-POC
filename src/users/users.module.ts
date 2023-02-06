import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users-rpc.controller';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { UsersTopology } from './users.topology';
import { AuthorizationModule } from '../authorization/authorization.module';

@Module({
  imports: [
    AuthorizationModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, UsersTopology),
  ],
  providers: [UsersService, UsersController]
})
export class UsersModule { }
