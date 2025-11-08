import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { AccountService } from '../services/account-service';
import { Game, State } from '../models/game';
import { Color, Piece } from "../models/pieces";
import { Router } from '@angular/router';
import { SocketService } from '../services/socket-service';
import { BoardComponent } from "../board-component/board-component";
import { PlayerBarComponent } from "../player-bar-component/player-bar-component";
import { Subscription } from 'rxjs';
import { ToastService } from '../services/toast-service';
import { Board } from '../models/board';
import { Account } from '../models/account';
import { HttpErrorResponse } from '@angular/common/http';
import { Move } from '../models/moves';

@Component({
	selector: 'game-component',
	imports: [CommonModule, BoardComponent, PlayerBarComponent],
	templateUrl: './game-component.html',
	styleUrl: './game-component.css'
})
export class GameComponent implements OnInit {
	protected COLOR_OPTIONS = Color;

	private tickSubscription = setInterval(() => { this.tick.set(Date.now()) }, 100);
	private tick = signal<number>(Date.now()); //ticks once per second for timers

	private gameSubscription: Subscription;
	protected game = signal<Game | null>(null);

	constructor(
		protected router: Router,
		protected accountService: AccountService,
		private socketService: SocketService,
		private toastService: ToastService
	) {
		this.gameSubscription = this.socketService.listen("games:gameUpdate").subscribe( (gameJson: any) => { 
			this.game.set({ ...gameJson, board: new Board(gameJson.board.squares) });
		});
	}

	public async ngOnInit(): Promise<void> {
		const usersActiveGame = await this.getUsersActiveGame();
		if (usersActiveGame != null) {
			this.game.set(usersActiveGame);
		} else {
			this.joinQueue();
		}
	}

	public ngOnDestroy(): void {
		if (this.tickSubscription) clearInterval(this.tickSubscription);
		if (this.gameSubscription) this.gameSubscription.unsubscribe();
	}

	/**
	 * Loads the users active game from the server
	 * 
	 * @returns their active game or null if there is none
	 */
	private async getUsersActiveGame(): Promise<Game | null> {
        try {
			const loggedInUsername = this.accountService.loggedInAccount()?.username;
			if (loggedInUsername == null) return null;

			const gameJson: any = await this.accountService.getAccountsActiveGame(loggedInUsername);
			return gameJson == null ? null : { ...gameJson, board: new Board(gameJson.board.squares) };
        } catch (err) {
            if (err instanceof HttpErrorResponse) {
                this.toastService.showToast({title: `${err.status} API Error`, message: err.error.error, type: 'danger', autoHideDelay: 3000})
            } else {
                this.toastService.showToast({title: 'Unexpected Error', message: 'Unable to fetch current game', type: 'danger', autoHideDelay: 3000})
            }
        }

		return null;
	}

	/**
	 * Attempts to join the game queue
	 */
	protected joinQueue(): void {
		this.socketService.emit("games:joinQueue", null);
	}

	/**
	 * Sends a move to the server
	 * 
	 * @param move - the move to send
	 */
	protected movePiece(move: Move) {
		this.socketService.emit('games:movePiece', this.game()!.uuid, move.origin, move.destination, move.promoteTo);
	}

	/*********************/
	/*Computed Info Start*/
	/*********************/
	protected board = computed<Board>(() => {
		return this.game() == null ? new Board(null) : this.game()!.board;
	})

	protected usersColor = computed<Color>(() => { 
		if (this.game() == null) return Color.White;
		return this.game()!.whitePlayer.username == this.accountService.loggedInAccount()!.username ? Color.White : Color.Black; 
	});

	protected isUsersTurn = computed<boolean>(() => {
		if (this.game() == null) return false;
		return this.usersColor() == Color.White ? this.game()!.currentState == State.WhitePlayersTurn : this.game()!.currentState == State.BlackPlayersTurn; 
	});

	protected usersTimeRemaining = computed<number>(() => { 
		if (this.game() == null) return 0;

		this.tick();

		const timeRemaining = (this.usersColor() == Color.White ? this.game()!.whiteTimeRemaining : this.game()!.blackTimeRemaining)
		if (!this.isUsersTurn()) return timeRemaining;

		return timeRemaining - (Date.now() - this.game()!.stateUpdatedAt);
	});

	protected usersCapturedPieces = computed<Piece[]>(() => {
		if (this.game() == null) return [];
		return this.game()!.board.getCapturedPiecesByColor(this.opponentsColor()!); 
	});

	protected opponentsAccount = computed<Account | null>(() => { 
		if (this.game() == null) return null;
		return this.game()!.whitePlayer.username == this.accountService.loggedInAccount()!.username ? this.game()!.blackPlayer : this.game()!.whitePlayer ;
	});

	protected opponentsColor = computed<Color>(() => {
		if (this.game() == null) return Color.Black;
		return this.game()!.whitePlayer.username == this.opponentsAccount()!.username ? Color.White : Color.Black; 
	});

	protected isOpponentsTurn = computed<boolean>(() => {
		if (this.game() == null) return false;
		return this.opponentsColor() == Color.White ? this.game()?.currentState == State.WhitePlayersTurn : this.game()?.currentState == State.BlackPlayersTurn; 
	});

	protected opponentsTimeRemaining = computed<number>(() => {
		if (this.game() == null) return 0;

		this.tick();

		const timeRemaining = (this.opponentsColor() == Color.White ? this.game()!.whiteTimeRemaining : this.game()!.blackTimeRemaining)
		if (!this.isOpponentsTurn()) return timeRemaining;

		return timeRemaining - (Date.now() - this.game()!.stateUpdatedAt);
	});

	protected opponentsCapturedPieces = computed<Piece[]>(() => { 
		if (this.game() == null) return [];
		return this.game()!.board.getCapturedPiecesByColor(this.usersColor()!); 
	});
	/*******************/
	/*Computed Info End*/
	/*******************/
}