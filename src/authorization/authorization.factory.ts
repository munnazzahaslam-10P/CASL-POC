import { InferSubjects, Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { User } from "../users/entities";
import { Action } from "./enums/action.enum";

export type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AuthorizationFactory {
    defineAbility(user: User) {
        //defining requirements
        const { can, cannot, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);

        if (user.isAdmin) {
            can(Action.Manage, 'all');
        } else {
            can(Action.Create, User);
            can(Action.Update, User, { id: user.id })
                .because('User can only edit his own profile');
        }

        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}