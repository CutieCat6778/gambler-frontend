import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Observable, Subject } from "rxjs";
import { WebSocketEvent, WebSocketMessage } from "../../types/websocket";
import env from "../lib/environment";
import { ApiService } from "./api.service";
import { User } from "../../types/models";

@Injectable({
  providedIn: "root",
})
export class WsService {
  private websocket: WebSocket | null = null;
  message: Observable<WebSocketMessage>;
  private user: User = {} as User;

  private recievedMessage: Subject<WebSocketMessage>;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
  ) {
    this.recievedMessage = new Subject<WebSocketMessage>();
    this.message = this.recievedMessage.asObservable();
    this.user = this.authService.user.getValue();
    console.log(this.user);
  }

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      console.log("User updated", user);
      this.user = user;
      if (
        this.authService.authenticated &&
        this.websocket == null &&
        this.user?.ID
      ) {
        this.connect(this.user.ID);
      }
    });
  }

  private connect(uuid: number) {
    console.log("Connecting to websocket");
    this.websocket = new WebSocket(`${env.BASE_URL}/ws/${uuid}`);
    this.websocket.onopen = () => {
      console.log("Websocket connected");
    };
    this.websocket.onmessage = (event) => {
      const data: Uint8Array = event.data;
      if (data.length < 1) {
        console.error("Invalid message");
        return;
      }
      if (!this.isValidEvent(data[0])) {
        console.error("Invalid event");
        return;
      }
      console.log("Recieved event", WebSocketEvent[data[0]]);
      if (data[0] == WebSocketEvent.BET_UPDATE) {
        this.updateBetEvent(
          this._convertChunksToNumber(
            new Array().concat(Array.from(data.slice(1))),
          ),
        );
        return;
      }
      this.recievedMessage.next({
        event: data[0],
        data: data.slice(1),
      });
    };
    this.websocket.onclose = () => {
      console.log("Websocket closed");
      this.recievedMessage.complete();
    };
  }

  private isValidEvent(eventID: number): boolean {
    return eventID in WebSocketEvent;
  }

  private async updateBetEvent(betID: number) {
    if (betID == 0) {
      const bets = await this.apiService.getAllBet();
      if (bets) {
        this.authService.updateAllBet(bets);
        return;
      }
    }
    const newBet = await this.apiService.getBet(betID);
    if (newBet) {
      this.authService.updateBet(newBet);
    }
  }

  private _convertChunksToNumber(chunks: number[]): number {
    let result = 0;
    for (const byte of chunks) {
      // Shift result left by 8 bits and add the current byte
      result = (result << 8) | byte;
    }

    // Check if the number exceeds JavaScript's safe integer limit
    if (result > Number.MAX_SAFE_INTEGER) {
      console.warn("Warning: The number exceeds the safe integer limit.");
    }

    return result;
  }
}
