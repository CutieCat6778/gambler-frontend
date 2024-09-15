import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Bet, User, UserBet } from "../../../types/models";
import { WsService } from "../../service/ws.service";
import { WebSocketEvent } from "../../../types/websocket";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ApiService } from "../../service/api.service";

@Component({
  selector: "bet-component",
  standalone: true,
  templateUrl: "./bet.component.html",
  styleUrl: "./bet.component.css",
  imports: [CommonModule, ReactiveFormsModule],
})
export class BetComponent {
  @Input() bet: Bet = {} as Bet;
  @Input() user: User = {} as User;

  public multiplier: number = 0;
  public betAmount: number = 0;

  public createdAt?: string;
  public endsAt?: string;
  public myBets?: UserBet[];

  public loaded: boolean = false;
  public createBetForm: FormGroup = {} as FormGroup;

  constructor(
    private ws: WsService,
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {
    this.ws.message.subscribe((msg) => {
      console.log(msg);
      if (msg) {
        switch (msg.event) {
          case WebSocketEvent.BET_INFO_RES:
            console.log(msg.data);
            const betId = this.ws._convertChunksToNumber(
              msg.data.slice(3, 3 + msg.data[0]),
            );
            const intNum = this.ws._convertChunksToNumber(
              msg.data.slice(3 + msg.data[0], 3 + msg.data[0] + msg.data[1]),
            );
            const fracNum = this.ws._convertChunksToNumber(
              msg.data.slice(3 + msg.data[0] + msg.data[1]),
            );
            console.log(betId, fracNum, intNum);
            if (betId != this.bet.ID) return;
            const newNumber = intNum + fracNum / 100;
            this.multiplier = newNumber;
        }
      }
    });
  }

  ngOnInit() {
    this.createdAt = new Date(this.bet.CreatedAt).toLocaleString();
    this.endsAt = new Date(this.bet.ends_at).toLocaleString();
    this.createBetForm = this.fb.group({
      amount: [
        0,
        [
          Validators.min(1),
          Validators.max(this.user.balance),
          Validators.required,
        ],
      ],
      options: ["", [Validators.required]],
    });
    this.createBetForm.valueChanges.subscribe(
      (data: { amount: number; options: string }) => {
        if (data.amount && data.options && this.createBetForm.valid) {
          console.log(data);
          const intNum = Math.floor(data.amount);
          const decNum = Math.trunc((data.amount - intNum) * 100);
          this.ws.send(
            WebSocketEvent.BET_INFO,
            new Uint8Array([
              this.bet.ID,
              this.bet.bet_options.indexOf(data.options),
              intNum,
              decNum,
            ]),
          );
        }
      },
    );
  }

  ngOnChanges() {
    this.myBets = this.bet.user_bets.filter((bet) => bet.user === this.user.ID);

    this.loaded = this.myBets != undefined && this.myBets.length > 0;
    console.log(this.loaded);
  }

  public getTotalBetAmount(): number {
    return this.bet.user_bets.reduce((acc, option) => acc + option.amount, 0);
  }

  public handleBet() {
    if (this.createBetForm.valid) {
      console.log(this.createBetForm.value);
      this.apiService.placeBet(
        this.bet.ID,
        this.createBetForm.get("amount")?.value,
        this.createBetForm.get("options")?.value,
      );
    }
  }
}
