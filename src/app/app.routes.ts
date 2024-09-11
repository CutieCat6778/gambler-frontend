import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { NotfoundComponent } from "./notfound/notfound.component";
import { authGuard } from "./guard/auth.guard";
import { inject } from "@angular/core";
import { AuthService } from "./service/auth.service";

export const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    canActivate: [authGuard],
  },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "*", component: NotfoundComponent },
];
