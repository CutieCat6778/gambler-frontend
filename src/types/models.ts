export interface Tokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpDate: string;
  refreshTokenExpDate: string;
}

interface CustomModel {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
}

export interface User extends CustomModel {
  name: string;
  username: string;
  password: string;
  email: string;
  balance: number;
  balance_history: BalanceHistory[];
  user_bet: UserBet[];
  refresh_token_version: number;
}

export interface BalanceHistory extends CustomModel {
  user_id: number;
  amount: number;
  reason: string;
}

export interface Bet extends CustomModel {
  name: string;
  description: string;
  user_bets: UserBet[];
  bet_options: string[];
  status: BetStatus;
  ends_at: string;
  author: number;
}

export interface UserBet extends CustomModel {
  user: number;
  bet_id: number;
  amount: number;
  bet_option: string;
}

// Define the BetStatus type and its constants
export type BetStatus = "Open" | "Pending" | "Closed" | "Cancelled";
