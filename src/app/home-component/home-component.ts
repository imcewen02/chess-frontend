import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../services/account-service';
import { ToastService } from '../services/toast-service';
import { HttpErrorResponse } from '@angular/common/http';
import { Account } from '../models/Account';
import { GameService } from '../services/game-service';

@Component({
	selector: 'app-home-component',
	imports: [],
	templateUrl: './home-component.html',
	styleUrl: './home-component.css'
})
export class HomeComponent implements OnInit {
	protected leaderboardList = signal<Account[]>([]);

	constructor(
		protected router: Router, 
		protected accountService: AccountService,
		protected gameService: GameService,
		private toastService: ToastService
	) { }

	public ngOnInit(): void {
		this.refreshLeaderboard();
	}

	private async refreshLeaderboard(): Promise<void> {
        try {
			const leaderboardList = await this.accountService.getAllAccounts();
			leaderboardList.sort((account1, account2) => account2.elo - account1.elo);
            this.leaderboardList.set(leaderboardList);
        } catch (err) {
            if (err instanceof HttpErrorResponse) {
                this.toastService.showToast({title: `${err.status} API Error`, message: err.error.error, type: 'danger', autoHideDelay: 3000})
            } else {
                this.toastService.showToast({title: 'Unexpected Error', message: 'Unable to refresh leaderboard, please try again later', type: 'danger', autoHideDelay: 3000})
            }
        } finally {

        }
	}
}
