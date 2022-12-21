import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

@Component({
  selector: 'app-games-history',
  templateUrl: './games-history.component.html',
  styleUrls: ['./games-history.component.scss']
})
export class GamesHistoryComponent implements OnInit {
  loading = false;
  data = [];
  usersTotalResults = [];

  constructor(
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.updateList();
  }

  updateList(): void {
    this.loading = true;
    this.usersTotalResults = [];
    this.appService
      .loadStats()
      .then(data => {
        const usersTotal = {};

        this.data = data ? data : [];
        console.log('this.data', this.data);
        this.data.sort((a, b) => +(new Date(a.date)) < +(new Date(b.date)) ? 1 : -1);
        this.data
          .forEach(item => {
            item.result.sort((a, b) => ~collator.compare(a.lostRounds, b.lostRounds));
            item.result[0].dealsCardsOften = true;
            item.result.sort((a, b) => ~collator.compare(a.totalScore, b.totalScore));

            item
              .result
              .forEach(v => {
                if (!usersTotal[v.user.id]) {
                  usersTotal[v.user.id] = {
                    user: v.user,
                    lostGames: 0,
                    // сдавал больше всего раз за игру
                    bestDispatcher: 0,
                    allTimeScore: 0
                  };
                }

                if (v.place === 1) {
                  usersTotal[v.user.id].lostGames++;
                }

                if (v.dealsCardsOften) {
                  usersTotal[v.user.id].bestDispatcher++;
                }

                usersTotal[v.user.id].allTimeScore += v.totalScore;
              });
            this.usersTotalResults = Object
              .keys(usersTotal)
              .map(userId => usersTotal[userId]);
          });
        console.log('usersTotalResults', this.usersTotalResults);
      })
      .finally(() => this.loading = false);
  }
}
