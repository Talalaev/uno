import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { filter } from 'rxjs/operators';
import { FinishGameComponent } from './components/finish-game/finish-game.component';
import { GameResultComponent } from './components/game-result/game-result.component';


export interface IGame {
  name?: string;
  data?: Date;
  place?: string;
  players?: Array<IPlayer>;
  rounds?: Array<{id: number}>;
  playUntil?: number;
  isFinished?: boolean;
}

export interface IPlayer {
  id: number;
  name?: string;
  rounds?: {[roundID: number]: {id: number; score: number}};
  totalScore?: number;
  totalScoreInPercentages?: number;
  place?: number;
  color?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  game: any = {
    isFinished: false,
  };

  constructor(
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const savedGame = JSON.parse(localStorage.getItem('uno-saved-game'));
    if (savedGame) {
      this.game = savedGame;
    }
  }

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
    this.saveGame();
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
    this.saveGame();
  }

  updatePlayersTotalScore(): void {
    const colors = ['warn', 'accent', 'primary'];
    let isItOver = false;

    this.game.players
      .forEach(player => {
        const totalScore = Object.keys(player.rounds)
          .map(index => player.rounds[index])
          .reduce((total, next) => {
            return total = total + Number(next.score);
          }, 0);
        player.totalScore = totalScore;
        isItOver = isItOver ? isItOver : this.game.playUntil < totalScore;
      });

    [...this.game.players]
      .sort((a, b) => b.totalScore - a.totalScore)
      .forEach((player, index) => {
        player.place = index + 1;
        const colorIndex = index > 2 ? 2 : index;
        player.color = colors[colorIndex];
        const totalScoreInPercentages = player.totalScore * 100 / this.game.playUntil;
        player.totalScoreInPercentages = totalScoreInPercentages >= 100 ? 100 : totalScoreInPercentages;
      });

    if (isItOver) {
      this.showGameResult();
    }
  }

  saveGame(): void {
    localStorage.setItem('uno-saved-game', JSON.stringify(this.game));
  }

  onFinishGameClick(): void {
    this.dialog.open(FinishGameComponent, {
      // height: '400px',
      width: '400px',
      data: this.game
    })
      .afterClosed()
      .pipe(filter(v => !!v))
      .subscribe(v => {
        this.game = {
          isFinished: false,
        };
        localStorage.removeItem('uno-saved-game');
      });
  }

  showGameResult(): void {
    this.dialog.open(GameResultComponent, {
      // height: '400px',
      width: '600px',
      data: this.game
    })
      .afterClosed()
      .pipe(filter(v => !!v))
      .subscribe(v => {
        this.game = {
          isFinished: false,
        };
        localStorage.removeItem('uno-saved-game');
      });
  }
}
