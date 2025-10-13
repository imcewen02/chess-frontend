import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, OnDestroy, OnInit, signal } from '@angular/core';
import { AccountService } from '../services/account-service';
import { Game, GAME_OVER_STATES, State } from '../models/game';
import { Position } from '../models/position';
import { BBishop, BKing, BKnight, BPawn, BQueen, BRook, Color, Name, Piece, WBishop, WKing, WKnight, WPawn, WQueen, WRook } from "../models/pieces";
import { Account } from '../models/account';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast-service';
import { HttpErrorResponse } from '@angular/common/http';
import { Board } from '../models/board';
import { SocketService } from '../services/socket-service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-game-component',
	imports: [CommonModule],
	templateUrl: './game-component.html',
	styleUrl: './game-component.css'
})
export class GameComponent implements OnInit, OnDestroy {
	Color = Color;
	Name = Name;
	State = State;
	GAME_OVER_STATES = GAME_OVER_STATES;

	private tick = signal<number>(Date.now()); //ticks once per second for timers
	private tickSubscription: number;

	private gameUpdateSubscription: Subscription;
	protected game = signal<Game>({} as Game);

	protected awaitingPawnPromotion: boolean = false;
	protected lastClickedPosition: Position | null = null;
	protected selectedPiece: Piece | null = null;
	@HostListener('click') onClick() { this.lastClickedPosition = null; this.selectedPiece = null; }

	constructor(
		protected router: Router,
		private accountService: AccountService,
		private socketService: SocketService,
		private toastService: ToastService
	) {
		this.tickSubscription = setInterval(() => { this.tick.set(Date.now()) }, 1000);
		this.gameUpdateSubscription = this.socketService.listen("games:gameUpdate").subscribe( (gameJson: any) => { 
			this.game.set({ ...gameJson, board: new Board(gameJson.board.squares) });
		});

		this.game.set({
			uuid: "",
			whitePlayer: this.accountService.loggedInAccount()!,
			whiteTimeRemaining: 0,
			blackPlayer: {username: "???", elo: 0} as Account,
			blackTimeRemaining: 0,
			board: new Board(null),
			currentState: State.NotStarted,
			stateUpdatedAt: 0
		})
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
		if (this.gameUpdateSubscription) this.gameUpdateSubscription.unsubscribe();
	}

	/**
	 * Attempts to join the game queue
	 */
	protected joinQueue(): void {
		this.socketService.emit("games:joinQueue", null);
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
			if (gameJson == null) return null;

			const game: Game = { ...gameJson, board: new Board(gameJson.board.squares) };
            return game;
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
     * Handles board interaction (checking for available moves, moving pieces, etc.)
	 * Interaction is only available during the users turn
     * 
     * @param clickedPosition the position that was clicked
     */
	protected onPositionClicked(clickedPosition: Position): void {
		this.lastClickedPosition = clickedPosition;

		if (!this.isUsersTurn()) {
			this.selectedPiece == null;
			return;
		};

		if (this.isPositionInSelectedPiecesLegalMoves(this.lastClickedPosition)) {
			//Move the selected piece
			if (this.selectedPiece?.name == Name.Pawn && this.lastClickedPosition.rank == (this.selectedPiece?.color == Color.White ? 8 : 1)) {
				this.awaitingPawnPromotion = true;
				return;
			}
			
			console.log(this.game().board.getPositionOfPiece(this.selectedPiece!), this.lastClickedPosition)
			this.socketService.emit('games:movePiece', this.game().uuid, this.game().board.getPositionOfPiece(this.selectedPiece!), this.lastClickedPosition);
			this.selectedPiece = null;
		} else {
			//Select your own piece
			const pieceAtClickedPosition = this.game().board.getPieceAtPosition(this.lastClickedPosition);
			if (pieceAtClickedPosition?.color == this.usersColor()) this.selectedPiece = pieceAtClickedPosition;
		}
	}

    /**
     * Handles the confirmation of a pawn promotion, sending a special move instruction
     * 
     * @param promoteTo the name of the piece to promote to
     */
	protected onPawnPromotionConfirmed(promoteTo: Name): void {
		console.log(this.game().board.getPositionOfPiece(this.selectedPiece!), this.lastClickedPosition, promoteTo)
		this.socketService.emit('games:movePiece', this.game().uuid, this.game().board.getPositionOfPiece(this.selectedPiece!), this.lastClickedPosition, promoteTo);
		this.selectedPiece = null;
		this.awaitingPawnPromotion = false;
	}

    /**
     * Checks if the provided position is one of the moves of the piece at the selected position
	 * 
	 * @param position the position to check for
     * 
     * @returns if the provided position is one of the moves of the piece at the selected position
     */
	protected isPositionInSelectedPiecesLegalMoves(position: Position): boolean {
		if (this.selectedPiece == null) return false;
		return this.selectedPiece.getAvailableMoves(this.game().board, true)!.some(move => move.rank == position.rank && move.file == position.file)
	}

    /**
     * Gets the lost material of the given color
	 * 
	 * @param color the color to get the lost material for
     * 
     * @returns the pieces that have been lost by the given color
     */
	private getLostPiecesByColor(color: Color): Piece[] {
		const remainingPieces = this.game().board.getPiecesByColor(color);
		const lostPieces: Piece[] = [];

		for (let lostPawns = 8 - remainingPieces.filter(piece => piece.name == Name.Pawn).length; lostPawns > 0; lostPawns--) {
			lostPieces.push(color == Color.White ? WPawn() : BPawn());
		}

		for (let lostRooks = 2 - remainingPieces.filter(piece => piece.name == Name.Rook).length; lostRooks > 0; lostRooks--) {
			lostPieces.push(color == Color.White ? WRook(false) : BRook(false));
		}

		for (let lostKnights = 2 - remainingPieces.filter(piece => piece.name == Name.Knight).length; lostKnights > 0; lostKnights--) {
			lostPieces.push(color == Color.White ? WKnight() : BKnight());
		}

		for (let lostBishops = 2 - remainingPieces.filter(piece => piece.name == Name.Bishop).length; lostBishops > 0; lostBishops--) {
			lostPieces.push(color == Color.White ? WBishop() : BBishop());
		}

		const queenLost = !remainingPieces?.some(piece => piece.name == Name.Queen);
		if (queenLost) lostPieces.push(color == Color.White ? WQueen() : BQueen());

		const kingLost = !remainingPieces?.some(piece => piece.name == Name.King);
		if (kingLost) lostPieces.push(color == Color.White ? WKing(false) : BKing(false));

		return lostPieces;
	}

    /**
     * Turns a millisecond value into a string value for display
	 * 
	 * @param msRemaining: the ms remaining
     * 
     * @returns the display value (stopping at 0)
     */
	protected timeRemainingMsToLabel(msRemaining: number): string {
		const minutes = msRemaining < 0 ? 0 : Math.floor(msRemaining / 60000);
		const seconds = msRemaining < 0 ? 0 : Math.floor((msRemaining % 60000) / 1000);
		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	}

	/**
     * Turns a state value into a string value for display
	 * 
	 * @param state: the state to get the label for
     * 
     * @returns the display value
     */
	protected getModalLabelFromEndState(state: State): string {
		switch(state) {
			case State.WhitePlayerWinByMate: return "White Player Wins By Mate";
			case State.WhitePlayerWinByTime: return "White Player Wins On Time";
			case State.WhitePlayerWinByResignation: return "White Player Wins By Resignation";
			case State.BlackPlayerWinByMate: return "Black Player Wins By Mate";
			case State.BlackPlayerWinByTime: return "Black Player Wins On Time";
			case State.BlackPlayerWinByResignation: return "Black Player Wins By Resignation";
			case State.Stalemate: return "Game Ends In Stalemate";
			case State.Draw: return "Game Ends In Draw";
			default: return "An Error Ocurred!";
		}
	}

	/*Board Computed Info Start*/
	protected ranks = computed<number[]>(() => { 
		return this.usersColor() == Color.White ? [...this.game().board.ranks].reverse() : this.game().board.ranks 
	});

	protected files = computed<string[]>(() => { 
		return this.usersColor() == Color.White ? this.game().board.files : [...this.game().board.files].reverse() 
	});
	/*Board Computed Info End*/

	/*Opponents Computed Info Start*/
	protected opponentsAccount = computed<Account | null>(() => { 
		const usersname = this.accountService.loggedInAccount()?.username;
		return this.game().whitePlayer.username == usersname ? this.game().blackPlayer : this.game().whitePlayer ;
	});

	protected opponentsColor = computed<Color | null>(() => { 
		return this.game().whitePlayer.username == this.usersAccount()?.username ? Color.Black : Color.White; 
	});

	protected isOpponentsTurn = computed<Boolean>(() => { 
		return this.opponentsColor() == Color.White ? this.game()?.currentState == State.WhitePlayersTurn : this.game()?.currentState == State.BlackPlayersTurn; 
	});

	protected opponentsTimeRemaining = computed<number | null>(() => { 
		this.tick();

		const timeRemaining = (this.opponentsColor() == Color.White ? this.game().whiteTimeRemaining : this.game().blackTimeRemaining)
		if (!this.isOpponentsTurn()) return timeRemaining;

		return timeRemaining - (Date.now() - this.game().stateUpdatedAt);
	});

	protected opponentsWonMaterial = computed<Piece[]>(() => { 
		return this.getLostPiecesByColor(this.usersColor()!) 
	});
	/*Opponents Computed Info End*/

	/*Users Computed Info Start*/
	protected usersAccount = computed<Account | null>(() => { 
		const usersname = this.accountService.loggedInAccount()?.username;
		return this.game().whitePlayer.username == usersname ? this.game().whitePlayer : this.game().blackPlayer; 
	});

	protected usersColor = computed<Color | null>(() => { 
		if (this.game == null) return null;
		return this.game().whitePlayer.username == this.usersAccount()?.username ? Color.White : Color.Black; 
	});

	protected isUsersTurn = computed<Boolean>(() => { 
		return this.usersColor() == Color.White ? this.game()?.currentState == State.WhitePlayersTurn : this.game()?.currentState == State.BlackPlayersTurn; 
	});

	protected usersTimeRemaining = computed<number | null>(() => { 
		this.tick();

		const timeRemaining = (this.usersColor() == Color.White ? this.game().whiteTimeRemaining : this.game().blackTimeRemaining)
		if (!this.isUsersTurn()) return timeRemaining;

		return timeRemaining - (Date.now() - this.game().stateUpdatedAt);
	});

	protected usersWonMaterial = computed<Piece[]>(() => { 
		return this.getLostPiecesByColor(this.opponentsColor()!) 
	});
	/*Users Computed Info End*/
}