import { Module } from '@nestjs/common';
import { AuthorizationFactory } from './authorization.factory';
import { PoliciesGuard } from './guards/policy.guard';

@Module({
  providers: [AuthorizationFactory, PoliciesGuard],
  exports: [AuthorizationFactory, PoliciesGuard],
})
export class AuthorizationModule {}