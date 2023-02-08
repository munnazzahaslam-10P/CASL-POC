import { SetMetadata } from "@nestjs/common";
import { IPolicyHandler } from "../interfaces/policy-handler.interface";

// This decorator allows specifying what policies have to be met to access specific resources.
export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: IPolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);