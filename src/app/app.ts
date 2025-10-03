import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastComponent } from "./toast-component/toast-component";
import { AccountService } from './services/account-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
	constructor(
		protected router: Router, 
		protected accountService: AccountService
	) { }
}
