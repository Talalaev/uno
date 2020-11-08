import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { filter } from 'rxjs/operators';


interface IGame {
  name?: string;
  data?: Date;
  place?: string;
  players?: Array<IPlayer>;
  rounds?: Array<{id: number}>;
}

interface IPlayer {
  id: number;
  name?: string;
  rounds?: {[roundID: number]: {id: number; score: number}};
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
          place: v.gamePlace,
          playersCount: v.playersCount
        });
      });
  }

  createGame({name, date, place, playersCount}): void {
    this.game.name = name;
    this.game.date = date;
    this.game.place = place;
    this.game.players = [];
    this.game.rounds = [];

    for (let i = 1; i <= playersCount; i++) {
      this.addPlayer({
        id: i,
        name: `нет имени ${i}`,
        rounds: {}
      });
    }
  }

  addPlayer(player): void {
    this.game.players.push(player);
  }
}
