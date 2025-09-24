import { effect, Injectable, signal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Game } from "../models/game";
import { SocketService } from "./socket-service";
import { AccountService } from "./account-service";
import { ToastService } from "./toast-service";
import { Position } from "../models/position";

@Injectable({
  providedIn: 'root'
})
export class GameService {

	public activeGame = signal<Game | null>(null); // tracks the current game of the logged in user

	constructor(
		private socketService: SocketService,
		private accountService: AccountService,
		private toastService: ToastService
	) {
		this.refreshActiveGame();

		this.socketService.listen("games:gameUpdate").subscribe( (gameJson: Game) => { 
			this.activeGame.set(gameJson);
		});

		effect(() => {
			const account = this.accountService.loggedInAccount();
			this.refreshActiveGame();
		});
	}

	/**
	 * Attempts to retrieve and set the logged in users active game
	 */
	private async refreshActiveGame(): Promise<void> {
        try {
			const loggedInUsername = this.accountService.loggedInAccount()?.username!;
			if (loggedInUsername == null) this.activeGame.set(null);

			const gameJson = await this.accountService.getAccountsActiveGame(loggedInUsername);
            this.activeGame.set(gameJson);
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

	public movePiece(origin: Position, destination: Position): void {
		this.socketService.emit('games:movePiece', origin, destination);
	}
}