import { Injectable } from "@angular/core";
import Axios, { AxiosInstance, AxiosResponse } from "axios";
import env from "../lib/environment";
import {
  CreateBetRequest,
  LoginResponse,
  ServerResponse,
} from "../../types/server";
import { Bet } from "../../types/models";

type NewType = CreateBetRequest;

@Injectable({
  providedIn: "root",
})
export class ApiService {
  public axios: AxiosInstance;

  constructor() {
    this.axios = Axios.create({
      baseURL: env.BASE_URL,
      withCredentials: true,
    });
  }

  public async login(
    username: string,
    password: string,
  ): Promise<LoginResponse> {
    return this.axios
      .post("/auth/login", {
        username,
        password,
      })
      .then((res: AxiosResponse<ServerResponse<LoginResponse>>) => {
        const result = res.data;
        if (result.code >= 300) {
          return result.message;
        }
        return result.body;
      })
      .catch((e) => {
        alert(e);
        console.error(e);
        return e;
      });
  }

  public async getSelf(): Promise<LoginResponse | null> {
    return this.axios
      .get("/user/@me")
      .then((res: AxiosResponse<ServerResponse<LoginResponse>>) => {
        const result = res.data;
        if (result.code >= 300) {
          return null;
        }
        return result.body;
      })
      .catch((e) => {
        console.error(e.message);
        return null;
      });
  }

  public async getAllBet(type?: number): Promise<Bet[] | null> {
    return this.axios
      .get(`/bets?type=${type ? type : 0}`)
      .then((res: AxiosResponse<ServerResponse<Bet[]>>) => {
        const result = res.data;
        if (result.code >= 300) {
          return null;
        }
        return result.body;
      })
      .catch((e) => {
        console.error(e.message);
        return null;
      });
  }

  public async getBet(id: number): Promise<Bet | null> {
    return this.axios
      .get(`/bets/${id}`)
      .then((res: AxiosResponse<ServerResponse<Bet>>) => {
        const result = res.data;
        if (result.code >= 300) {
          return null;
        }
        return result.body;
      })
      .catch((e) => {
        console.error(e.message);
        return null;
      });
  }

  public async createBet(bet: CreateBetRequest): Promise<Bet | null> {
    return this.axios
      .post("/bets/create", bet)
      .then((res: AxiosResponse<ServerResponse<Bet>>) => {
        const result = res.data;
        if (result.code >= 300) {
          return null;
        }
        return result.body;
      })
      .catch((e) => {
        console.error(e.message);
        return null;
      });
  }

  public async placeBet(
    betID: number,
    amount: number,
    option: string,
  ): Promise<boolean> {
    console.log(amount, option);
    return this.axios
      .put(`/bets/place/${betID}`, {
        betID,
        amount,
        option: option,
      })
      .then((res: AxiosResponse<ServerResponse<boolean>>) => {
        const result = res.data;
        if (result.code >= 300) {
          return false;
        }
        return result.body;
      })
      .catch((e) => {
        console.error(e.message);
        return false;
      });
  }
}
