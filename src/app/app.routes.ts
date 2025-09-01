import { Routes } from '@angular/router';
import { GameComponent } from './game-component/game-component';
import { HomeComponent } from './home-component/home-component';
import { NotFoundComponent } from './not-found-component/not-found-component';
import { LoginComponent } from './login-component/login-component';
import { SignupComponent } from './signup-component/signup-component';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: 'game', component: GameComponent },
	{ path: '**', component: NotFoundComponent }
];