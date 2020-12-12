import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, OnDestroy {
  gamesList = [];
  intevalId;
  updateIinterval = 1000 * 60 * 2;

  constructor(public http: HttpClient) { }

  ngOnInit(): void {
    this.updateList();
    this.intevalId = setInterval(() => {
      this.updateList();
    }, this.updateIinterval);
  }

  ngOnDestroy(): void {
    clearInterval(this.intevalId);
  }

  updateList() {
    this.getGames().then(games => this.gamesList = games);
  }

  getGames() {
    return fetch('/api/games', {
      mode: 'cors',
      method: 'GET',
      headers: {
        'Origin':'*',
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(games => {
        return games;
      })
      .catch(e => {
        console.log(e);
        return [];
      });
  }
}
