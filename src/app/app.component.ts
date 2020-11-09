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
  playUntil?: number;
  isFinished?: boolean;
}

interface IPlayer {
  id: number;
  name?: string;
  rounds?: {[roundID: number]: {id: number; score: number}};
  totalScore?: 0;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  game: any = {
    isFinished: false,
  };

  constructor(
    public dialog: MatDialog
  ) {}

  // get gameTotal() {
  //   return this.game.players.
  // }

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
          date: v.createData,
          place: v.gamePlace,
          playersCount: v.playersCount,
          playUntil: v.gamePlayUntil
        });
      });
  }

  createGame({name, date, place, playersCount, playUntil}): void {
    this.game.name = name;
    this.game.date = date;
    this.game.place = place;
    this.game.players = [];
    this.game.rounds = [];
    this.game.playUntil = playUntil;

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

  onStartGame(): void {
    this.nextRound();
  }

  nextRound(): void {
    const nextRoundID = this.game.rounds.length + 1;
    this.game.rounds.push({id: nextRoundID});
    this.game.players.forEach(player => player.rounds[nextRoundID] = {id: nextRoundID, score: 0});

    this.updatePlayersTotalScore();
  }

  updatePlayersTotalScore(): void {
    this.game.players
      .forEach(player => {
        player.totalScore = Object.keys(player.rounds)
          .map(index => player.rounds[index])
          .reduce((total, next) => {
            return total = total + Number(next.score);
          }, 0);
      });
  }
}
