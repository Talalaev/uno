import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IGame, IPlayer } from '../game/game.component';

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.scss']
})
export class GameResultComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public game: IGame) { }

  get sortedPlayers(): Array<IPlayer> {
    return [...this.game.players].sort((a, b) => b.totalScore - a.totalScore);
  }

  ngOnInit(): void {
  }

}
