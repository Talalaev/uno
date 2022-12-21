import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface IPlace {
  pin: string;
  id: number;
  name: string;
}

export interface IGameTemplate {
  id: number;
  name: string;
  place: string;
  play_until: number;
  players: Array<{name: string; id: number}>;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  place: IPlace;
  gameTemplate: IGameTemplate;
  useTemplate = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    const place = localStorage.getItem('uno-place');
    const template = localStorage.getItem('uno-game-template');

    if (place) {
      this.place = JSON.parse(place);
    }
    if (template) {
      this.gameTemplate = JSON.parse(template);
      this.useTemplate = true;
    }
  }

  setPlace(place: IPlace): void {
    this.place = place;
    localStorage.setItem('uno-place', JSON.stringify(place));
  }

  setGameTemplate(template: IGameTemplate): void {
    this.gameTemplate = template;
    localStorage.setItem('uno-game-template', JSON.stringify(template));
  }

  checkPin(pin): Promise<IPlace> {
    return this.http
      .get<{result: boolean; place: string; id: number;}>(`http://talalaev.site/uno/login.php?pin=${pin}`)
      .toPromise()
      .then(data => {
        if (data.result) {
          return {
            pin,
            id: data.id,
            name: data.place,
          };
        }

        return null;
      });
  }

  logout(): void {
    this.place = null;
    localStorage.removeItem('uno-place');
    this.gameTemplate = null;
    localStorage.removeItem('uno-game-template');
  }

  loadTemplate(): Promise<IGameTemplate> {
    if (!this.place) {
      alert('Вы не можете загружать шаблоны');
    }

    return this.http
      .get<Array<IGameTemplate>>(`http://talalaev.site/uno/game_templates.php?pin=${this.place.pin}`)
      .toPromise()
      .then<IGameTemplate>(data => {
        const firsTemplate = data.find(item => item.id == 1);

        return firsTemplate ? firsTemplate : null;
      });
  }

  saveGameResult(result): void {
    if (!result.date) {
      result.date = +new Date();
    }

    if (!confirm('Сохранить результаты?')) {
      return;
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this.http
      .post(
        `http://talalaev.site/uno/save_game_result.php?pin=${this.place.pin}`,
        {
          ...result,
          place: Number(result.place),
        },
        {headers}
      )
      .toPromise()
      .then(data => this.snackBar.open('Сохранено!', 'Закрыть'))
      .catch(error => {
        console.log(error);
        this.snackBar.open('Ошибка!', 'Закрыть');
      });
  }

  loadStats(): Promise<any> {
    return this.http
      .get<{id: number; place: string; date: string; result: string;}>(`http://talalaev.site/uno/game_results.php?pin=${this.place.pin}`)
      .toPromise()
      .then(data => {
        return data;
      })
      .catch(e => console.log(e));
  }
}
