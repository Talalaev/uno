import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IGame, IPlayer } from '../game/game.component';


@Component({
  selector: 'app-finish-game',
  templateUrl: './finish-game.component.html',
  styleUrls: ['./finish-game.component.scss']
})
export class FinishGameComponent implements OnInit {

  get sortedPlayers(): Array<IPlayer> {
    return [...this.game.players].sort((a, b) => b.totalScore - a.totalScore);
  }

  get result(): Array<{place: number; userId: number; totalScore: number; lostRounds: number; }> {
    return this.sortedPlayers.map(player => ({
      place: player.place,
      userId: player.id,
      totalScore: player.totalScore,
      lostRounds: player.lostRounds,
    }));
  }

  constructor(@Inject(MAT_DIALOG_DATA) public game: IGame) { }

  ngOnInit(): void {
  }

}
