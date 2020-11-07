import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { filter } from 'rxjs/operators';


interface IGame {
  name?: string;
  data?: Date;
  players?: Array<IPlayer>;
  rounds: Array<{id: number}>;
}

interface IPlayer {
  id: number;
  name?: string;
  rounds: {[roundID: number]: {id: number; score: number}};
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  game: any = {};

  constructor(
    public dialog: MatDialog
  ) {}

  public onCreateGame(): void {
    this.dialog.open(CreateGameComponent, {
      // height: '400px',
      width: '600px',
    })
      .afterClosed()
      .pipe(filter(v => !!v))
      .subscribe(v => {
        this.createGame({
          name: v.gameName,
          date: v.createDate,
          player: { id: 1, name: v.playerName }
        });
      });
  }

  createGame({name, date, player}): void {
    this.game.name = name;
    this.game.date = date;
    this.game.players = [];
    this.game.rounds = [{id: 1}, {id: 2}];
    this.addPlayer(player);
  }

  addPlayer(player): void {
    this.game.players.push({
      ...player,
      rounds: {
        1: {score: 0},
        2: {score: 20}
      }
    });
  }
}
