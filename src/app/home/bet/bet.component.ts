import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Bet } from "../../../types/models";
import { WsService } from "../../service/ws.service";

@Component({
  selector: "bet-component",
  standalone: true,
  templateUrl: "./bet.component.html",
  styleUrl: "./bet.component.css",
  imports: [CommonModule],
})
export class BetComponent {
  @Input() bet: Bet = {} as Bet;

  constructor(private ws: WsService) {
    this.ws.message.subscribe((msg) => {
      console.log(msg);
    });
  }

  ngOnInit() {
    console.log(this.bet);
  }
}
