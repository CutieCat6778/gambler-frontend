import { Component } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { AuthService } from "./service/auth.service";
import { User } from "../types/models";
import { CommonModule } from "@angular/common";
import { WsService } from "./service/ws.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  public user: User = {} as User;
  public currRoute: string;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.currRoute = this.router.url;
    this.router.events.subscribe((event) => {
      this.currRoute = this.router.url;
    });
    this.authService.user.subscribe((data) => {
      this.user = data;
    });
  }

  ngAfterContentInit() {
    console.log("Curr Route", this.currRoute);
  }

  title = "Gambler App";
}
