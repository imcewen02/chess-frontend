import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastComponent } from "./toast-component/toast-component";
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
	constructor(
		protected router: Router, 
		private authService: AuthService
	) { }

	protected logoutUser() { 
		this.authService.logout();
		this.router.navigateByUrl("/")
	}

	protected getCurrentUser(): string | null {
		return this.authService.getCurrentUsername();
	}
}
