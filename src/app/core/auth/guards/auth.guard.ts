// auth.guard.ts
import { inject } from '@angular/core';
import {
    CanActivateFn,
    CanActivateChildFn,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';
import { AbilityService } from '../ability.service';

function checkAccess(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) {
    const router = inject(Router);
    const authService = inject(AuthService);
    const abilityService = inject(AbilityService);

    return authService.check().pipe(
        switchMap((authenticated) => {
            if (!authenticated) {
                const redirectURL =
                    state.url === '/sign-out' ? '' : `redirectURL=${state.url}`;
                return of(router.parseUrl(`sign-in?${redirectURL}`));
            }

            abilityService.updateFromToken();

            const action = route.data?.['action'];
            const subject = route.data?.['subject'];

            if (action && subject) {
                console.log(action, subject);
                const canAccess = abilityService.can(action, subject);
                // if (!canAccess) {
                //     return of(router.parseUrl('/not-authorized'));
                // }
            }

            return of(true);
        })
    );
}

export const AuthGuard: CanActivateFn & CanActivateChildFn = (route, state) =>
    checkAccess(route, state);
