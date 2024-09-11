import { Component } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { AuthService } from "./service/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    if (!this.authService.dataLoaded) {
      this.authService
        .loadData()
        .then(() => {
          if (!this.authService.authenticated) {
            this.router.navigate(["/login"]);
          } else this.router.navigate(["/home"]);
        })
        .catch((e) => {
          this.router.navigate(["/login"]);
        });
      return;
    }
    if (!this.authService.authenticated) {
      this.router.navigate(["/login"]);
    } else this.router.navigate(["/home"]);
  }

  title = "Gambler App";
}
