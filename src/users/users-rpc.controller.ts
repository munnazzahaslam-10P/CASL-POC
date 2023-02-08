import { Controller, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { RabbitRPC, MessageHandlerErrorBehavior, RabbitPayload } from '@golevelup/nestjs-rabbitmq';
import { AUTHORIZATION_RPC_EXCHANGE_NAME, ROUTE, QUEUE } from './users.topology';
import { CheckPolicies } from '../authorization/decorators/check-policies.decorator';
import { Action } from '../authorization/enums/action.enum';
import { Campaign, User } from './entities';
import { PoliciesGuard } from '../authorization/guards/policy.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  
  @UseGuards(PoliciesGuard)
  @CheckPolicies({action: Action.Create, subjects: User})
  @RabbitRPC({
    exchange: AUTHORIZATION_RPC_EXCHANGE_NAME,
    routingKey: ROUTE.CREATE_CAMPAIGN,
    queue: QUEUE.CREATE_CAMPAIGN,
    errorBehavior: MessageHandlerErrorBehavior.ACK,
  })
  createUser(
    @RabbitPayload() userDto: UserDto
  ) {
    return this.usersService.createUser(userDto);
  }

  @RabbitRPC({
    exchange: AUTHORIZATION_RPC_EXCHANGE_NAME,
    routingKey: ROUTE.UPDATE_CAMPAIGN,
    queue: QUEUE.UPDATE_CAMPAIGN,
    errorBehavior: MessageHandlerErrorBehavior.ACK,
  })
  updateUser(
    @RabbitPayload() userDto: UserDto
  ) {
    return this.usersService.updateUser(userDto);
  }
}
