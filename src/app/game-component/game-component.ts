import { CommonModule } from '@angular/common';
import { Component, effect, HostListener } from '@angular/core';
import { GameService } from '../services/game-service';
import { AccountService } from '../services/account-service';
import { Game } from '../models/game';
import { Position } from '../models/position';
import { Piece } from '../models/piece';

@Component({
	selector: 'app-game-component',
	imports: [CommonModule],
	templateUrl: './game-component.html',
	styleUrl: './game-component.css'
})
export class GameComponent {
	protected game: Game = this.generateEmptyGame();

	protected lookingForGame: boolean = true;

	protected rowLabels = [8, 7, 6, 5, 4, 3, 2, 1];
	protected colLabels = ["A", "B", "C", "D", "E", "F", "G", "H"];

	protected selectedSquare: Position | null = null;
	protected possibleMoves: Position[] = [];

	constructor(
		private accountService: AccountService,
		private gameService: GameService
	) {
		this.refreshGame();

		effect(() => {
			const game = gameService.activeGame();
			this.refreshGame();
		});
	}

	protected onSquareClicked(rowIdx: number, colIdx: number) {
		if (!this.isPlayersTurn()) {
			this.selectedSquare = null;
			this.possibleMoves = [];
			return;
		}

		const pieceOnSquare = this.getPieceAtPosition(rowIdx, colIdx);
		const playerColor = this.isFromWhitePerspective() ? "white" : "black";

		if (this.positionInPossibleMoves(rowIdx, colIdx)) {
			const realOrigin = this.translatePosition({row: this.selectedSquare?.row!, col: this.selectedSquare?.col!});
			const realDestination = this.translatePosition({row: rowIdx, col: colIdx});
			this.gameService.movePiece(realOrigin, realDestination);

			this.selectedSquare = null;
			this.possibleMoves = [];
		} else if (pieceOnSquare?.color == playerColor) {
			this.selectedSquare = {row: rowIdx, col: colIdx}
			const possibleMoves = this.game.currentAvailableMoves.find(ms => ms.origin.row == rowIdx && ms.origin.col == colIdx)?.destinations;
			this.possibleMoves = possibleMoves != undefined ? possibleMoves : [];
		} else {
			this.selectedSquare = null;
			this.possibleMoves = [];
		}
	}

	protected positionInPossibleMoves(rowIdx: number, colIdx: number): boolean {
		return this.possibleMoves.some(move => move.row == rowIdx && move.col == colIdx);
	}

	protected getPieceAtPosition(rowIdx: number, colIdx: number): Piece | null {
		return this.game?.board.squares[rowIdx][colIdx];
	}

	private translatePosition(position: Position): Position {
		return {row: this.isFromWhitePerspective() ? 7 - position.row : position.row, col: this.isFromWhitePerspective() ? position.col : 7 - position.col};
	}

	protected isFromWhitePerspective(): boolean {
		return this.gameService.activeGame() == null || this.gameService.activeGame()?.whiteAccount.username == this.accountService.loggedInAccount()?.username;
	}

	protected isPlayersTurn(): boolean {
		const playerColor = this.isFromWhitePerspective() ? "white" : "black";
		return this.gameService.activeGame()?.currentTurn == playerColor;
	}

	protected refreshGame() {
		if (this.gameService.activeGame() != null) {
			this.game = this.generateGameFormattedForDisplay(this.gameService.activeGame()!);

			this.lookingForGame = false;

			if (this.isFromWhitePerspective()) {
				this.rowLabels = [8, 7, 6, 5, 4, 3, 2, 1];
				this.colLabels = ["A", "B", "C", "D", "E", "F", "G", "H"];
			} else {
				this.rowLabels = [1, 2, 3, 4, 5, 6, 7, 8];
				this.colLabels = ["H", "G", "F", "E", "D", "C", "B", "A"];
			}
		} else {
			this.game = this.generateEmptyGame();

			this.lookingForGame = true;

			this.rowLabels = [8, 7, 6, 5, 4, 3, 2, 1];
			this.colLabels = ["A", "B", "C", "D", "E", "F", "G", "H"];

			this.gameService.joinQueue();
		}
	}

	private generateEmptyGame(): Game {
		return {
			uuid: "",
			whiteAccount: null!,
			blackAccount: null!,
			board: {
				squares: [
					[null, null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null, null]
				]
			},
			currentTurn: "white",
			currentAvailableMoves: []
		}
	}

	private generateGameFormattedForDisplay(game: Game): Game {
		const copy: Game = {
			uuid: game.uuid,
			whiteAccount: {...game.whiteAccount},
			blackAccount: {...game.blackAccount},
			board: { 
				squares: game.board.squares.map(row => row.map(piece => piece ? { ...piece } : null) ) 
			},
			currentTurn: game.currentTurn,
			currentAvailableMoves: game.currentAvailableMoves.map(ms => ({
				origin: { row: ms.origin.row, col: ms.origin.col },
				destinations: ms.destinations.map(d => ({ row: d.row, col: d.col }))
			}))
		}

		if (this.isFromWhitePerspective()) {
			copy.board.squares.reverse();
		} else {
			copy.board.squares.forEach( row => row.reverse() );
		}

		copy.currentAvailableMoves = copy.currentAvailableMoves.map(ms => ({
			origin: this.translatePosition(ms.origin),
			destinations: ms.destinations.map(d => (this.translatePosition(d)))
		}))

		return copy;
	}
}