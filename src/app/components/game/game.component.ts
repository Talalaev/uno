import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import * as Chance from 'chance';
import { CreateGameComponent } from '../create-game/create-game.component';
import { FinishGameComponent } from '../finish-game/finish-game.component';
import { GameResultComponent } from '../game-result/game-result.component';
import { GameSourceComponent } from '../game-source/game-source.component';
const chance = new Chance();


export interface IGame {
  id?: string;
  name?: string;
  date?: Date;
  place?: string;
  players?: Array<IPlayer>;
  rounds?: Array<{id: number}>;
  playUntil?: number;
  distributor?: boolean;
  isFinished?: boolean;
}

export interface IPlayer {
  id: number;
  name?: string;
  rounds?: {[roundID: number]: {id: number; score: number; distributor: boolean}};
  totalScore?: number;
  totalScoreInPercentages?: number;
  lostRounds: number;
  place?: number;
  color?: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @ViewChild('ripple') ripple;
  game: any = {
    isFinished: false,
  };

  lockNextRound = false;

  constructor(
    public dialog: MatDialog,
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
    this.game.id = `${chance.integer({ min: 100, max: 10000 })}-${chance.integer({ min: 100, max: 10000 })}-${+(new Date)}`;
    this.game.name = name;
    this.game.date = date;
    this.game.place = place;
    this.game.players = [];
    this.game.rounds = [];
    this.game.playUntil = playUntil;
    const distributorID = [1, 2, 3].map(i => {
      return chance.integer({ min: 1, max: Number(playersCount) });
    })[2];

    for (let i = 1; i <= playersCount; i++) {
      this.addPlayer({
        id: i,
        name: `нет имени ${i}`,
        rounds: {},
        distributor: i === distributorID,
        lostRounds: 0
      });
    }

    this.saveGame();
  }

  addPlayer(player): void {
    this.game.players.push(player);
  }

  onStartGame(): void {
    this.nextRound(true);
  }

  nextRound(firstRound: boolean = false): void {
    if (this.lockNextRound) {
      return;
    }
    this.lockNextRound = true;
    setTimeout(() => this.lockNextRound = false, 500);
    const nextRoundID = this.game.rounds.length + 1;
    this.game.rounds.push({id: nextRoundID});
    this.game.players.forEach(player => player.rounds[nextRoundID] = {
      id: nextRoundID,
      score: 0,
      distributor: player.distributor
    });

    this.updatePlayersTotalScore(firstRound);
    this.saveGame();
    this.ripple.launch();
  }

  updatePlayersTotalScore(firstRound: boolean = false): void {
    const colors = ['warn', 'accent', 'primary'];
    let isItOver = false;
    let distributorID = 1;
    let maxScore = 0;
    let lastRoundId = this.game.rounds[this.game.rounds.length - 1].id;
    lastRoundId = this.game.rounds.length === 1 ? 1 : lastRoundId - 1;

    this.game.players
      .forEach(player => {
        const totalScore = Object.keys(player.rounds)
          .map(index => player.rounds[index])
          .reduce((total, next) => {
            return total = total + Number(next.score);
          }, 0);
        player.totalScore = totalScore;
        isItOver = isItOver ? isItOver : this.game.playUntil <= totalScore;

        const lastRoundPlayerScore = player.rounds[lastRoundId].score;
        if (maxScore < lastRoundPlayerScore) {
          maxScore = lastRoundPlayerScore;
          distributorID = player.id;
        }
      });
    if (firstRound === false) {
      this.game.players
        .forEach(player => {
          player.distributor = player.id === distributorID;
          player.rounds[lastRoundId].distributor = player.id === distributorID;
        });
    }

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
      this.game.isFinished = true;
      this.showGameResult();
    }
  }

  saveGame(): void {
    localStorage.setItem('uno-saved-game', JSON.stringify(this.game));
    this.addGame(this.game);
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
        if (v.repeat) {
          this.restartGame();
          return;
        }

        this.finishGame(this.game);
        this.game = {
          isFinished: false,
        };
        localStorage.removeItem('uno-saved-game');
      });
  }

  showGameResult(): void {
    this.game.players
      .forEach(player => {
        player.lostRounds = 0;
        player.lostRounds = this.game.rounds.reduce((result, round) => {
          if (player.rounds[round.id].distributor) {
            result++;
          }

          return result;
        }, 0);
      });
    this.dialog.open(GameResultComponent, {
      // height: '400px',
      width: '600px',
      data: this.game
    })
      .afterClosed()
      .pipe(filter(v => !!v))
      .subscribe(v => {
        if (v.repeat) {
          this.restartGame();
          return;
        }

        this.game = {
          isFinished: false,
        };
        localStorage.removeItem('uno-saved-game');
      });
  }

  restartGame(): void {
    const playersCount = this.game.players.length;
    const distributorID = [1, 2, 3].map(i => {
      return chance.integer({ min: 1, max: Number(playersCount) });
    })[2];

    this.game.date = new Date();
    this.game.isFinished = false;
    this.game.rounds = [];
    this.game.players.forEach((player, index) => {
      player.rounds = {};
      player.lostRounds = 0;
      player.distributor = (index + 1) === distributorID;
    });

    this.nextRound(true);
  }

  onSourceClick(): void {
    this.dialog.open(GameSourceComponent, {
      // height: '400px',
      width: '600px',
      data: this.game
    })
      .afterClosed()
      .pipe(filter(v => !!v))
      .subscribe(game => {
        let newGame;
        try {
          newGame = JSON.parse(game);
          this.game = newGame;
          this.saveGame();
        } catch (e) {
          console.log(e);
        }
      });
  }

  addGame(game): void {
    fetch('http://localhost:3000/add-game', {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify(game),
      headers: {
        'Origin':'*',
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .catch(e => {
        console.log(e);
      });
  }

  finishGame(game): void {
    fetch('http://localhost:3000/finish-game', {
      mode: 'cors',
      method: 'DELETE',
      body: JSON.stringify(game),
      headers: {
        'Origin':'*',
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .catch(e => {
        console.log(e);
      });
  }
}
