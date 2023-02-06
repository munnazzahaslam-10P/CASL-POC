import { Controller, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
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
  @CheckPolicies({action: Action.Create, subjects: Campaign})
  @RabbitRPC({
    exchange: AUTHORIZATION_RPC_EXCHANGE_NAME,
    routingKey: ROUTE.CREATE_USER,
    queue: QUEUE.CREATE_USER,
    errorBehavior: MessageHandlerErrorBehavior.ACK,
  })
  createCampaign(
    @RabbitPayload() createCampaignDto: CreateCampaignDto
  ) {
    return this.usersService.createCampaign(createCampaignDto);
  }
}
