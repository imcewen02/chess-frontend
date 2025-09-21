import { Injectable, signal } from "@angular/core";
import { SocketService } from "./socket-service";
import { Game } from "../models/Game";
import { AccountService } from "./account-service";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastService } from "./toast-service";

@Injectable({
  providedIn: 'root'
})
export class GameService {
	private static readonly BASE_URL = "http://localhost:3000";

	public activeGame = signal<Game | null>(null); // tracks the current game of the logged in user

	constructor(
		private socketService: SocketService,
		private accountService: AccountService,
		private toastService: ToastService
	) {
		this.populateActiveGame();
		this.socketService.listen("games:gameUpdate").subscribe((game: Game) => this.activeGame.set(game));
	}

	/**
	 * Attempts to retrieve and set the logged in users active game
	 */
	private async populateActiveGame(): Promise<void> {
        try {
			const loggedInUsername = this.accountService.getLoggedInAccount()?.username!;
            this.activeGame.set(await this.accountService.getAccountsActiveGame(loggedInUsername));
        } catch (err) {
            if (err instanceof HttpErrorResponse) {
                this.toastService.showToast({title: `${err.status} API Error`, message: err.error.error, type: 'danger', autoHideDelay: 3000})
            } else {
                this.toastService.showToast({title: 'Unexpected Error', message: 'Unable to fetch current game', type: 'danger', autoHideDelay: 3000})
            }
        }
	}

	public joinQueue(): void {
		this.socketService.emit("games:joinQueue", null);
	}
}