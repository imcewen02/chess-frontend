import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
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
export class GameComponent {
	protected game = computed<Game | null>(() => { return this.gameService.activeGame() ? this.gameService.activeGame()! : null });
	protected ranks = computed<number[]>(() => { return this.game == null ? [] : this.usersColor() == Color.White ? [...this.game()!.board.ranks].reverse() : this.game()!.board.ranks });
	protected files = computed<string[]>(() => { return this.game == null ? [] : this.usersColor() == Color.White ? this.game()!.board.files : [...this.game()!.board.files].reverse() });

	protected opponentsAccount = computed<Account | null>(() => { return this.game == null ? null : this.game()!.whitePlayer.username == this.accountService.loggedInAccount()?.username ? this.game()!.blackPlayer : this.game()!.whitePlayer });
	protected opponentsColor = computed<Color | null>(() => { return this.game() == null ? null : this.game()!.whitePlayer.username == this.usersAccount()?.username ? Color.Black : Color.White; });
	protected opponentsWonMaterial = computed<Piece[]>(() => { return this.game() == null ? [] : this.getLostPiecesByColor(this.usersColor()!) });

	protected usersAccount = computed<Account | null>(() => { return this.accountService.loggedInAccount(); });
	protected usersColor = computed<Color | null>(() => { return this.game() == null ? null : this.game()!.whitePlayer.username == this.usersAccount()?.username ? Color.White : Color.Black; });
	protected usersWonMaterial = computed<Piece[]>(() => { return this.game() == null ? [] : this.getLostPiecesByColor(this.opponentsColor()!) });

	protected isUsersTurn = computed<Boolean>(() => { return this.game() == null ? false : this.game()!.currentTurn == this.usersColor(); });

	protected selectedPosition: Position | null = null; //The last clicked position

	constructor(
		private accountService: AccountService,
		private gameService: GameService
	) {
		this.gameService.joinQueue();
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
}