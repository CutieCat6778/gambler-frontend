import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { WebSocketEvent, WebSocketMessage } from "../../types/websocket";
import env from "../lib/environment";
import { ApiService } from "./api.service";
import { User } from "../../types/models";

@Injectable({
  providedIn: "root",
})
export class WsService {
  private websocket: WebSocket | null = null;
  message: BehaviorSubject<WebSocketMessage | null>;
  private user: User = {} as User;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
  ) {
    this.message = new BehaviorSubject<WebSocketMessage | null>(null);
    this.user = this.authService.user.getValue();
    if (
      this.authService.authenticated &&
      this.websocket == null &&
      this.user?.ID
    ) {
      console.log("Connecting");
      this.connect(this.user.ID);
    }
  }

  private connect(uuid: number) {
    console.log("Connecting to websocket");
    this.websocket = new WebSocket(`${env.BASE_URL}/ws/${uuid}`);

    this.websocket.binaryType = "blob";

    this.websocket.onopen = () => {
      console.log("Websocket connected");
    };

    this.websocket.onmessage = (event) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(event.data);
      reader.addEventListener("loadend", (e) => {
        const data: Uint8Array = new Uint8Array(e.target?.result as any);
        console.log(data);
        if (data.length < 1) {
          console.error("Invalid message");
          return;
        }
        if (!this.isValidEvent(data[0])) {
          console.error("Invalid event");
          return;
        }
        if (data[1] != env.WS_VERSION) {
          console.error("Invalid version");
          return;
        }
        console.log("Recieved event", WebSocketEvent[data[0]]);
        if (data[0] == WebSocketEvent.WS_CONNECTION) {
          console.log("Server responded with OK");
          return;
        }
        if (data[0] == WebSocketEvent.BET_UPDATE) {
          this.updateBetEvent(
            this._convertChunksToNumber(
              new Array().concat(Array.from(data.slice(1))),
            ),
          );
          return;
        }
        this.message.next({
          event: data[0],
          data: data.slice(1),
        });
      });
    };
    this.websocket.onclose = () => {
      console.log("Websocket closed");
      this.message.complete();
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
