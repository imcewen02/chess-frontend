import { Routes } from '@angular/router';
import { GameComponent } from './game-component/game-component';
import { HomeComponent } from './home-component/home-component';
import { NotFoundComponent } from './not-found-component/not-found-component';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'game', component: GameComponent },
	{ path: '**', component: NotFoundComponent }
];