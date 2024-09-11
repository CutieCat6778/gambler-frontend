import { Component } from "@angular/core";
import { AuthService } from "../service/auth.service";
import { ActivatedRoute } from "@angular/router";
import { Bet, User } from "../../types/models";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  public user: User;
  public bets: Bet[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) {
    this.user = this.authService.user;
    this.bets = this.authService.bets;
  }
}
