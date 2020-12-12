import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IGame } from '../game/game.component';


@Component({
  selector: 'app-game-source',
  templateUrl: './game-source.component.html',
  styleUrls: ['./game-source.component.scss']
})
export class GameSourceComponent implements OnInit {
  sourceObject = {};

  constructor(@Inject(MAT_DIALOG_DATA) public game: IGame) { }

  ngOnInit(): void {
    this.sourceObject = JSON.stringify({...this.game});
  }

}
