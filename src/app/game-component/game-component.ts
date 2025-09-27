import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { GameService } from '../services/game-service';
import { AccountService } from '../services/account-service';
import { Game } from '../models/game';
import { Position } from '../models/position';
import { Color } from '../models/pieces';
import { Account } from '../models/account';

@Component({
	selector: 'app-game-component',
	imports: [CommonModule],
	templateUrl: './game-component.html',
	styleUrl: './game-component.css'
})
export class GameComponent {
	protected game = computed<Game | null>(() => { return this.gameService.activeGame() ? this.gameService.activeGame()! : null });
	protected ranks = computed<number[]>(() => { return this.game == null ? [] : this.getUsersColor() == Color.White ? [...this.game()!.board.ranks].reverse() : this.game()!.board.ranks });
	protected files = computed<string[]>(() => { return this.game == null ? [] : this.getUsersColor() == Color.White ? this.game()!.board.files : [...this.game()!.board.files].reverse() });

	protected opponentsAccount = computed<Account | null>(() => { 
		if (this.game == null) return null;
		const username = this.accountService.loggedInAccount()?.username;
		return this.game()!.whitePlayer.username == username ? this.game()!.blackPlayer : this.game()!.whitePlayer 
	});

	protected usersAccount = computed<Account | null>(() => { 
		return this.accountService.loggedInAccount();
	});

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
		} else if (this.game()!.board.getPieceAtPosition(position)?.color == this.getUsersColor()) {
			this.selectedPosition = position;
		} else {
			this.selectedPosition = null;
		}
	}

    /**
     * Checks if it is the current logged in users turn
     * 
     * @returns if it is the current logged in users turn
     */
	protected isUsersTurn(): boolean {
		if (this.game() == null || this.usersAccount() == null) return false;
		return this.game()!.currentTurn == Color.White ? this.game()!.whitePlayer.username == this.usersAccount()?.username : this.game()!.blackPlayer.username == this.usersAccount()?.username;
	}

    /**
     * Gets the current logged in users color in the game (or null if there is no game)
     * 
     * @returns the current logged in users color in the game (or null if there is no game)
     */
	protected getUsersColor(): Color | null {
		if (this.game() == null || this.usersAccount() == null) return null;
		return this.game()!.whitePlayer.username == this.usersAccount()?.username ? Color.White : Color.Black;
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
}