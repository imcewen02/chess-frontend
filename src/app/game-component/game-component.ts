import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Piece, Pawn, Rook, Knight, Bishop, Queen, King, Color } from './pieces';

@Component({
	selector: 'app-game-component',
	imports: [CommonModule],
	templateUrl: './game-component.html',
	styleUrl: './game-component.css'
})
export class GameComponent {

	boardData = new Map<string, Piece | null>();
	files: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
	ranks: number[] = [8, 7, 6, 5, 4, 3, 2, 1];

	selectedSquare: string = '';

	playerColor: Color = Color.WHITE;

	ngOnInit() {
		this.initializeStartingBoard();
	}

	getPieceBySquare(file: string, rank: number) : Piece | null | undefined {
		return this.boardData.get(file + rank);
	}

	onSquareClicked(file: string, rank: number) {
		this.selectedSquare = file + rank;
	}

	getSquareColorClass(file: string, rank: number) : string {
		if (file + rank == this.selectedSquare && this.boardData.get(file + rank) != null && this.boardData.get(file + rank)?.getColor() == this.playerColor) {
			return 'bg-warning'
		}

		const squareDark = (this.files.indexOf(file) + rank) % 2 != 0;
		if (squareDark) {
			return 'bg-success'
		} else {
			return 'bg-light'
		}
	}

	initializeStartingBoard() {
		//Create entries for every space
		this.files.forEach( file => { this.ranks.forEach( rank => { this.boardData.set(file + rank, null); } ) } );

		//Fill in the starting spaces
		this.boardData.set('A1', new Rook(Color.WHITE))
		this.boardData.set('B1', new Knight(Color.WHITE))
		this.boardData.set('C1', new Bishop(Color.WHITE))
		this.boardData.set('D1', new Queen(Color.WHITE))
		this.boardData.set('E1', new King(Color.WHITE))
		this.boardData.set('F1', new Bishop(Color.WHITE))
		this.boardData.set('G1', new Knight(Color.WHITE))
		this.boardData.set('H1', new Rook(Color.WHITE))

		this.boardData.set('A2', new Pawn(Color.WHITE))
		this.boardData.set('B2', new Pawn(Color.WHITE))
		this.boardData.set('C2', new Pawn(Color.WHITE))
		this.boardData.set('D2', new Pawn(Color.WHITE))
		this.boardData.set('E2', new Pawn(Color.WHITE))
		this.boardData.set('F2', new Pawn(Color.WHITE))
		this.boardData.set('G2', new Pawn(Color.WHITE))
		this.boardData.set('H2', new Pawn(Color.WHITE))

		this.boardData.set('A8', new Rook(Color.BLACK))
		this.boardData.set('B8', new Knight(Color.BLACK))
		this.boardData.set('C8', new Bishop(Color.BLACK))
		this.boardData.set('D8', new Queen(Color.BLACK))
		this.boardData.set('E8', new King(Color.BLACK))
		this.boardData.set('F8', new Bishop(Color.BLACK))
		this.boardData.set('G8', new Knight(Color.BLACK))
		this.boardData.set('H8', new Rook(Color.BLACK))

		this.boardData.set('A7', new Pawn(Color.BLACK))
		this.boardData.set('B7', new Pawn(Color.BLACK))
		this.boardData.set('C7', new Pawn(Color.BLACK))
		this.boardData.set('D7', new Pawn(Color.BLACK))
		this.boardData.set('E7', new Pawn(Color.BLACK))
		this.boardData.set('F7', new Pawn(Color.BLACK))
		this.boardData.set('G7', new Pawn(Color.BLACK))
		this.boardData.set('H7', new Pawn(Color.BLACK))
	}
}