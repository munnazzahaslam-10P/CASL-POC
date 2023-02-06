import { InferSubjects, Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Campaign, User } from "../users/entities";
import { Action } from "./enums/action.enum";

export type Subjects = InferSubjects<typeof User | typeof Campaign> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AuthorizationFactory {
    defineAbility(user: User) {
        const { can, cannot, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);
        if (user.isAdmin) {
            can(Action.Manage, 'all');
        } else {
            can(Action.Create, Campaign);
            cannot(Action.Create, Campaign);
            cannot(Action.Update, Campaign, { campaignId: { $ne: user.campaignId } })
                .because('User can only edit his own campaigns');
        }

        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}