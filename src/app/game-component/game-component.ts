import { CommonModule } from '@angular/common';
import { Component, computed, OnDestroy, signal } from '@angular/core';
import { GameService } from '../services/game-service';
import { AccountService } from '../services/account-service';
import { Game } from '../models/game';
import { Position } from '../models/position';
import { BBishop, BKing, BKnight, BPawn, BQueen, BRook, Color, Name, Piece, WBishop, WKing, WKnight, WPawn, WQueen, WRook } from "../models/pieces";
import { Account } from '../models/account';

@Component({
	selector: 'app-game-component',
	imports: [CommonModule],
	templateUrl: './game-component.html',
	styleUrl: './game-component.css'
})
export class GameComponent implements OnDestroy {
	Color = Color;

	protected game = computed<Game | null>(() => { return this.gameService.activeGame() ? this.gameService.activeGame()! : null });
	protected ranks = computed<number[]>(() => { return this.game == null ? [] : this.usersColor() == Color.White ? [...this.game()!.board.ranks].reverse() : this.game()!.board.ranks });
	protected files = computed<string[]>(() => { return this.game == null ? [] : this.usersColor() == Color.White ? this.game()!.board.files : [...this.game()!.board.files].reverse() });

	private tick = signal<number>(Date.now()); //ticks once per second for timers
	private tickSubscription: any = null;

	/*Opponents Computed Info Start*/
	protected opponentsAccount = computed<Account | null>(() => { 
		if (this.game() == null) return null;
		const usersname = this.accountService.loggedInAccount()?.username;
		return this.game()!.whitePlayer.username == usersname ? this.game()!.blackPlayer : this.game()!.whitePlayer ;
	});

	protected opponentsColor = computed<Color | null>(() => { 
		if (this.game() == null) return null;
		return this.game()!.whitePlayer.username == this.usersAccount()?.username ? Color.Black : Color.White; 
	});

	protected opponentsTimeRemaining = computed<number | null>(() => { 
		this.tick();
		if (this.game() == null) return null;

		const timeRemaining = (this.opponentsColor() == Color.White ? this.game()!.whiteTimeRemaining : this.game()!.blackTimeRemaining)
		if (this.game()?.currentTurn != this.opponentsColor()) return timeRemaining;

		return timeRemaining - (Date.now() - this.game()!.currentTurnSince);
	});

	protected opponentsWonMaterial = computed<Piece[]>(() => { 
		if (this.game() == null) return [];
		return this.getLostPiecesByColor(this.usersColor()!) 
	});
	/*Opponents Computed Info End*/

	/*Users Computed Info Start*/
	protected usersAccount = computed<Account | null>(() => { 
		if (this.game() == null) return null;
		const usersname = this.accountService.loggedInAccount()?.username;
		return this.game()!.whitePlayer.username == usersname ? this.game()!.whitePlayer : this.game()!.blackPlayer; 
	});

	protected usersColor = computed<Color | null>(() => { 
		if (this.game == null) return null;
		return this.game()!.whitePlayer.username == this.usersAccount()?.username ? Color.White : Color.Black; 
	});

	protected usersTimeRemaining = computed<number | null>(() => { 
		this.tick();
		if (this.game() == null) return null;

		const timeRemaining = (this.usersColor() == Color.White ? this.game()!.whiteTimeRemaining : this.game()!.blackTimeRemaining)
		if (this.game()?.currentTurn != this.usersColor()) return timeRemaining;

		return timeRemaining - (Date.now() - this.game()!.currentTurnSince);
	});

	protected usersWonMaterial = computed<Piece[]>(() => { 
		if (this.game() == null) return [];
		return this.getLostPiecesByColor(this.opponentsColor()!) 
	});

	protected isUsersTurn = computed<Boolean>(() => { 
		if (this.game() == null) return false;
		return this.game()!.currentTurn == this.usersColor(); 
	});
	/*Users Computed Info End*/

	protected selectedPosition: Position | null = null; //The last clicked position

	constructor(
		private accountService: AccountService,
		private gameService: GameService
	) {
		this.gameService.joinQueue();
		this.tickSubscription = setInterval(() => { this.tick.set(Date.now()) }, 10);
	}

	ngOnDestroy(): void {
		if (this.tickSubscription) clearInterval(this.tickSubscription);
	}

    /**
     * Handles board interaction (checking for available moves, moving pieces, etc.)
	 * Interaction is only available during the users turn
     * 
     * @param position the position that was clicked
     */
	protected onPositionClicked(position: Position): void {
		if (!this.isUsersTurn()) {
			this.selectedPosition = null;
			return;
		}

		if (this.isPositionInSelectedPiecesLegalMoves(position)) {
			this.gameService.movePiece(this.selectedPosition!, position);
			this.selectedPosition = null;
		} else if (this.game()!.board.getPieceAtPosition(position)?.color == this.usersColor()) {
			this.selectedPosition = position;
		} else {
			this.selectedPosition = null;
		}
	}

    /**
     * Checks if the provided position is one of the moves of the piece at the selected position
	 * 
	 * @param position the position to check for
     * 
     * @returns if the provided position is one of the moves of the piece at the selected position
     */
	protected isPositionInSelectedPiecesLegalMoves(position: Position): boolean {
		if (this.game() == null) return false;

		const pieceAtSelectedPosition = this.selectedPosition ? this.game()!.board.getPieceAtPosition(this.selectedPosition) : null;
		if (!pieceAtSelectedPosition) return false;

		return pieceAtSelectedPosition.getAvailableMoves(this.game()!.board, true)!.some(move => move.rank == position.rank && move.file == position.file)
	}

    /**
     * Gets the lost material of the given color
	 * 
	 * @param color the color to get the lost material for
     * 
     * @returns the pieces that have been lost by the given color
     */
	private getLostPiecesByColor(color: Color): Piece[] {
		if (this.game() == null) return [];

		const remainingPieces = this.game()!.board.getPiecesByColor(color);
		const lostPieces: Piece[] = [];

		for (let lostPawns = 8 - remainingPieces.filter(piece => piece.name == Name.Pawn).length; lostPawns > 0; lostPawns--) {
			lostPieces.push(color == Color.White ? WPawn() : BPawn());
		}

		for (let lostRooks = 2 - remainingPieces.filter(piece => piece.name == Name.Rook).length; lostRooks > 0; lostRooks--) {
			lostPieces.push(color == Color.White ? WRook() : BRook());
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
		if (kingLost) lostPieces.push(color == Color.White ? WKing() : BKing());

		return lostPieces;
	}

    /**
     * Turns a millisecond value into a string value for display
	 * 
	 * @param msRemaining: the ms remaining
     * 
     * @returns the display value
     */
	protected timeRemainingMsToLabel(msRemaining: number): string {
		const minutes = Math.floor(msRemaining / 60000);
		const seconds = Math.floor((msRemaining % 60000) / 1000);
		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	}
}