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

export interface CreateBetRequest {
  name: string;
  description: string;
  betOptions: string[];
  inputBet: number;
  inputOption: string;
  endsAt: string;
}
