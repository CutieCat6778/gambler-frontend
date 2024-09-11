import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../service/auth.service";

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);

  if (!authService.dataLoaded) return false;

  if (authService.authenticated) {
    return true;
  } else {
    console.warn("User is not authenticated!");
    router.navigate(["/login"]);
    return false;
  }
};
