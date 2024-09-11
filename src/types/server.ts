import { Bet, User } from "./models";

export interface ServerResponse<T> {
  success: boolean;
  message: string;
  body: T;
  code: number;
}

export interface LoginResponse {
  user: User;
  bets: Bet[];
}
