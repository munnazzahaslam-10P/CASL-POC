import { ForbiddenError } from "@casl/ability";
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AppAbility, AuthorizationFactory } from "../authorization.factory";
import { CHECK_POLICIES_KEY } from "../decorators/check-policies.decorator";
import { IPolicyHandler } from "../interfaces/policy-handler.interface";

@Injectable()
export class PoliciesGuard implements CanActivate {
  private readonly logger: Logger = new Logger(PoliciesGuard.name);

  constructor(
    private reflector: Reflector,
    private AuthorizationFactory: AuthorizationFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //extract rules bounded to a route handler through check policies decorator
    const rules =
      this.reflector.get<IPolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    //extracting user object from request
    const { user } = context.switchToRpc().getData();

    //creating ability to verify whether a user has sufficient permissions to perform specific actions
    const ability = this.AuthorizationFactory.defineAbility(user);

    try {

      // check for each rule and throw if user is not allowed to perform a particular action of specified subject
      rules.forEach((rule) =>
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subjects)
      );
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        this.logger.error(error.message);
        throw new ForbiddenException(error.message);
      }
    }
  }
}