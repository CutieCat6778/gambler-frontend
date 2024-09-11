import { Injectable } from "@angular/core";
import Axios, { AxiosInstance, AxiosResponse } from "axios";
import env from "../lib/environment";
import { LoginResponse, ServerResponse } from "../../types/server";
import { Bet, User } from "../../types/models";
import { Router } from "@angular/router";

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
}
