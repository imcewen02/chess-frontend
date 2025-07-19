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

	ngOnInit() {

	}

	onSquareClicked(file: string, rank: number) {
		this.selectedSquare = new Square(file, rank);
	}

	getSquareColorClass(file: string, rank: number) : string {
		if (file + rank == this.selectedSquare?.toStringId() && this.board.getPieceOnSquare(new Square(file, rank))?.getColor() == this.playerColor) {
			return 'bg-warning'
		}

		return (this.board.getFileAsNumber(file) + rank) % 2 == 0 ? 'bg-success' : 'bg-light'
	}

	getSquareFromFileAndRank(file: string, rank: number) : Square {
		return new Square(file, rank);
	}
}