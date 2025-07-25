// ability.service.ts
import { Injectable } from '@angular/core';
import { Ability } from '@casl/ability';
import { AppAbility, defineAbilitiesFromScopes } from './ability';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AbilityService {
    ability = new Ability<AppAbility>();

    constructor(private authService: AuthService) {}

    updateFromToken() {
        const scopes = this.authService.scopes;
        const defined = defineAbilitiesFromScopes(scopes);
        this.ability.update(defined.rules);
    }

    can(action: string, subject: string): boolean {
        return this.ability.can(action, subject);
    }
}
