import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Color } from './pieces';
import { Board } from './board';

@Component({
	selector: 'app-game-component',
	imports: [CommonModule],
	templateUrl: './game-component.html',
	styleUrl: './game-component.css'
})
export class GameComponent {
	board: Board = new Board();
	playerColor: Color = Color.WHITE;
	selectedSquare: string = '';

	ngOnInit() {

	}

	onSquareClicked(file: string, rank: number) {
		this.selectedSquare = file + rank;
	}

	getSquareColorClass(file: string, rank: number) : string {
		if (file + rank == this.selectedSquare && this.board.getPieceOnSquare(file, rank)?.getColor() == this.playerColor) {
			return 'bg-warning'
		}

		if ((this.board.getFiles().indexOf(file) + rank) % 2 != 0) {
			return 'bg-success'
		} else {
			return 'bg-light'
		}
	}
}