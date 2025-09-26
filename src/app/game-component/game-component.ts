import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { GameService } from '../services/game-service';
import { AccountService } from '../services/account-service';
import { Game } from '../models/game';
import { Position } from '../models/position';
import { Color } from '../models/pieces';
import { Board } from '../models/board';

@Component({
	selector: 'app-game-component',
	imports: [CommonModule],
	templateUrl: './game-component.html',
	styleUrl: './game-component.css'
})
export class GameComponent {
	private static readonly EMPTY_GAME: Game = {
		uuid: "",
		whitePlayer: null!,
		blackPlayer: null!,
		board: new Board(null),
		currentTurn: Color.White
	};

	protected game = computed<Game>(() => { return this.gameService.activeGame() ? this.gameService.activeGame()! : GameComponent.EMPTY_GAME });

	protected selectedPosition: Position | null = null;

	constructor(
		private accountService: AccountService,
		private gameService: GameService
	) {
		this.gameService.joinQueue();
	}

	protected onPositionClicked(position: Position): void {
		if (!this.isUsersTurn()) {
			this.selectedPosition = null;
			return;
		}

		if (this.isPositionInSelectedPiecesLegalMoves(position)) {
			this.gameService.movePiece(this.selectedPosition!, position);
			this.selectedPosition = null;
		} else if (this.game().board.getPieceAtPosition(position)?.color == this.getUsersColor()) {
			this.selectedPosition = position;
		} else {
			this.selectedPosition = null;
		}
	}

	protected isUsersTurn(): boolean {
		const usersName = this.accountService.loggedInAccount()?.username;
		return this.game().currentTurn == Color.White ? this.game().whitePlayer.username == usersName : this.game().blackPlayer.username == usersName;
	}

	protected getUsersColor(): Color {
		const usersName = this.accountService.loggedInAccount()?.username;
		return this.game().whitePlayer.username == usersName ? Color.White : Color.Black;
	}

	protected isPositionInSelectedPiecesLegalMoves(position: Position): boolean {
		const pieceAtSelectedPosition = this.selectedPosition ? this.game().board.getPieceAtPosition(this.selectedPosition) : null;
		if (!pieceAtSelectedPosition) return false;

		return pieceAtSelectedPosition.getAvailableMoves(this.game().board, true)!.some(move => move.rank == position.rank && move.file == position.file)
	}
}