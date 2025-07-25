// ability.ts
import { AbilityBuilder, AbilityClass, Ability } from '@casl/ability';

export type AppAbility = [string, string];

export function defineAbilitiesFromScopes(scopes: string[]) {
    const { can, build } = new AbilityBuilder<Ability<AppAbility>>(
        Ability as AbilityClass<Ability<AppAbility>>
    );

    scopes.forEach((scope) => {
        const [action, ...subjectParts] = scope.split(' ');
        const subject = subjectParts.join(' ');
        can(action, subject);
    });

    return build({
        detectSubjectType: (item: any) => item.type,
    });
}
