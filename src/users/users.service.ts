import { Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class UsersService {
  createCampaign(createCampaignDto: CreateCampaignDto) {
    console.log(createCampaignDto);
  }
}
