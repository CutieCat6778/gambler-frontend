import { Injectable } from "@angular/core";
import { Bet, User } from "../../types/models";
import { ApiService } from "./api.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public user: User;
  public bets: Bet[];
  public authenticated: boolean;
  public dataLoaded: boolean;

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    this.user = {} as User;
    this.bets = [];
    this.authenticated = false;
    this.dataLoaded = false;
  }

  public async loadData() {
    try {
      const res = await this.apiService.getSelf();
      if (!res) throw new Error("Failed to load user data");
      console.log(res);
      this.user = res.user;
      this.bets = res.bets;
      this.authenticated = true;
      this.dataLoaded = true;
    } catch (e) {
      console.error("Failed to load user data");
      this.authenticated = false;
      this.dataLoaded = true;
      this.router.navigate(["/login"]);
    }
  }

  public getData() {
    return {
      user: this.user,
      bets: this.bets,
      authenticated: this.authenticated,
    };
  }
}
