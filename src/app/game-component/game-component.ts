import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Color, Piece } from './pieces';
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

	@HostListener('document:click', ['$event'])
	onClick(event: MouseEvent) {
		this.selectedSquare = null;
		this.possibleMoves = [];
	}

	onSquareClicked(file: string, rank: number) {
		if (this.isSquareInPossibleMoves(file, rank)) {
			this.board.movePiece(this.selectedSquare!, new Square(file, rank));
			this.selectedSquare = null;
			this.possibleMoves = [];
		} else {
			this.selectedSquare = new Square(file, rank);
			this.possibleMoves = [];

			const pieceAtSquare = this.board.getPieceOnSquare(new Square(file, rank));
			if (pieceAtSquare?.getColor() == this.playerColor) {
				this.possibleMoves = pieceAtSquare.getPossibleMoves(this.selectedSquare, this.board);
			}
		}
	}

	getSquareColorClass(file: string, rank: number) : string {
		if (file + rank == this.selectedSquare?.toStringId() && this.board.getPieceOnSquare(new Square(file, rank))?.getColor() == this.playerColor) {
			return 'highlight'
		}

		return (this.board.getFileAsNumber(file) + rank) % 2 == 0 ? 'dark' : 'light'
	}

	getPieceOnSquare(file: string, rank: number) : Piece | null | undefined {
		return this.board.getPieceOnSquare(new Square(file, rank))
	}

	isSquareInPossibleMoves(file: string, rank: number) : boolean {
		return this.possibleMoves.some( square => square.getFile() == file && square.getRank() == rank);
	}
}