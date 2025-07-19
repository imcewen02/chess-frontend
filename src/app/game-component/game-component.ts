import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Color } from './pieces';
import { Board, Square } from './board';

@Component({
	selector: 'app-game-component',
	imports: [CommonModule],
	templateUrl: './game-component.html',
	styleUrl: './game-component.css'
})
export class GameComponent {
	board: Board = new Board();
	playerColor: Color = Color.WHITE;
	selectedSquare: Square | null = null;
	possibleMoves: Square[] = [];

	onSquareClicked(file: string, rank: number) {
		this.selectedSquare = new Square(file, rank);
		this.possibleMoves = [];

		const pieceAtSqaure = this.board.getPieceOnSquare(new Square(file, rank));
		if (pieceAtSqaure?.getColor() == this.playerColor) {
			this.possibleMoves = pieceAtSqaure.getPossibleMoves(this.selectedSquare, this.board);
		}
	}

	getSquareColorClass(file: string, rank: number) : string {
		if (file + rank == this.selectedSquare?.toStringId() && this.board.getPieceOnSquare(new Square(file, rank))?.getColor() == this.playerColor) {
			return 'bg-warning'
		}

		return (Board.getFileAsNumber(file) + rank) % 2 == 0 ? 'bg-success' : 'bg-light'
	}

	getSquarePieceImage(file: string, rank: number) : string | undefined {
		return this.board.getPieceOnSquare(new Square(file, rank))?.getImageSource()
	}

	isSquareInPossibleMoves(file: string, rank: number) : boolean {
		return this.possibleMoves.some( square => square.getFile() == file && square.getRank() == rank);
	}
}