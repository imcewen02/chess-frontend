import { effect, Injectable, signal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Game } from "../models/game";
import { SocketService } from "./socket-service";
import { AccountService } from "./account-service";
import { ToastService } from "./toast-service";
import { Position } from "../models/position";
import { Board } from "../models/board";

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
		
		effect(() => { 
			this.accountService.loggedInAccount(); 
			this.refreshActiveGame(); 
		});

		this.socketService.listen("games:gameUpdate").subscribe( (gameJson: any) => { 
			this.activeGame.set({ ...gameJson, board: new Board(gameJson.board.squares) }); 
		});
	}

	/**
	 * Attempts to retrieve and set the logged in users active game
	 */
	private async refreshActiveGame(): Promise<void> {
		this.activeGame.set(null);

        try {
			const loggedInUsername = this.accountService.loggedInAccount()?.username;
			if (loggedInUsername == null) return;

			const gameJson: any = await this.accountService.getAccountsActiveGame(loggedInUsername);
			if (gameJson == null) return;

			const game: Game = { ...gameJson, board: new Board(gameJson.board.squares) };
            this.activeGame.set(game);
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
		this.socketService.emit('games:movePiece', this.activeGame()?.uuid, origin, destination);
	}
}