import { Component } from "@angular/core";
import { AuthService } from "../service/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Bet, User } from "../../types/models";
import { BetComponent } from "./bet/bet.component";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-home",
  imports: [BetComponent, FormsModule, CommonModule],
  standalone: true,
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  public user: User = {} as User;
  public bets: Bet[] = [];
  public pendingBets: Bet[] = [];
  public closedBets: Bet[] = [];
  public cancelledBets: Bet[] = [];

  public betTypeSelector: string = "open";

  constructor(private authService: AuthService) {
    this.user = this.authService.user.getValue();
    this.bets = this.authService.bets.getValue();
    this.authService.user.subscribe((data) => {
      console.log(data);
      this.user = data;
    });
    this.authService.bets.subscribe((data) => {
      console.log(data);
      this.bets = data;
    });
  }

  public handleBetTypeSelectorChange(event: Event) {
    this.betTypeSelector = (event.target as HTMLSelectElement).value;
    console.log(this.betTypeSelector);
  }

  ngOnInit() {
    this.user = this.authService.user.getValue();
  }
}
