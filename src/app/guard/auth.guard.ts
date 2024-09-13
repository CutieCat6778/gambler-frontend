import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../service/auth.service";

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);

  if (!authService.dataLoaded) {
    authService
      .loadData()
      .then(() => {
        if (!authService.authenticated) {
          console.log("User is not authenticated!");
          router.navigate(["/login"]);
          return false;
        } else {
          return true;
        }
      })
      .catch((e) => {
        router.navigate(["/login"]);
        return false;
      });
  } else if (authService.dataLoaded && !authService.authenticated) {
    router.navigate(["/login"]);
    return false;
  }

  return true;
};
