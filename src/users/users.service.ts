import { ForbiddenError } from '@casl/ability';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { AuthorizationFactory } from '../authorization/authorization.factory';
import { Action } from '../authorization/enums/action.enum';
import { UserDto } from './dto/user.dto';
import { User } from './entities';

@Injectable()
export class UsersService {
  logger = new Logger(UsersService.name);
  constructor(private authorizationFactory: AuthorizationFactory) { }
  createUser(userDto: UserDto) {
    console.log('You are allowed to create campaigns');
  }

  updateUser(userDto: UserDto) {
    const user = new User();
    user.id = 2;

    const ability = this.authorizationFactory.defineAbility(userDto);

    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, user);
      console.log('Campaign updated!');
    } catch (error) {
      if (error instanceof ForbiddenError) {
        this.logger.error(error.message);
        throw new ForbiddenException(error.message);
      }
    }
  }
}
