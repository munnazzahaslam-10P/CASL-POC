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
    const rules =
      this.reflector.get<IPolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToRpc().getData();

    const ability = this.AuthorizationFactory.defineAbility(user);

    try {
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