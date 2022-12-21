import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatsComponent } from './components/stats/stats.component';
import { GameComponent } from './components/game/game.component';
import { GamesHistoryComponent } from './components/games-history/games-history.component';

const routes: Routes = [
  {
    path: '',
    component: GameComponent
  },
  {
    path: 'translations',
    component: StatsComponent
  },
  {
    path: 'stats',
    component: GamesHistoryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
