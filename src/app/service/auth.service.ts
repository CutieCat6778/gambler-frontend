import { Injectable } from "@angular/core";
import { Bet, User } from "../../types/models";
import { ApiService } from "./api.service";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public user: BehaviorSubject<User>;
  public bets: BehaviorSubject<Bet[]>;
  public authenticated: boolean;
  public dataLoaded: boolean;

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    this.user = new BehaviorSubject<User>({} as User);
    this.bets = new BehaviorSubject<Bet[]>([]);
    this.authenticated = false;
    this.dataLoaded = false;
    console.log("New init");
  }

  public async loadData() {
    console.time("loadData");
    try {
      const res = await this.apiService.getSelf();
      if (!res) throw new Error("Failed to load user data");
      console.log(res);
      this.user.next(res.user);
      this.bets.next(res.bets);
      this.authenticated = true;
      this.dataLoaded = true;
    } catch (e) {
      console.timeEnd("loadData");
      console.error("Failed to load user data");
      this.authenticated = false;
      this.dataLoaded = true;
    }
  }

  public updateAllBet(bets: Bet[]) {
    this.bets.next(bets);
  }

  public updateBet(bet: Bet) {
    const bets = this.bets.getValue();
    const index = bets.findIndex((b) => b.ID === bet.ID);
    if (index === -1) return this.addBet(bet);
    bets[index] = bet;
    this.bets.next(bets);
  }

  public addBet(bet: Bet) {
    const bets = this.bets.getValue();
    bets.push(bet);
    this.bets.next(bets);
  }

  public updateUser(user: User) {
    console.log(user);
    this.user.next(user);
  }
}
