import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IGame } from '../game/game.component';


@Component({
  selector: 'app-finish-game',
  templateUrl: './finish-game.component.html',
  styleUrls: ['./finish-game.component.scss']
})
export class FinishGameComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public game: IGame) { }

  ngOnInit(): void {
  }

}
