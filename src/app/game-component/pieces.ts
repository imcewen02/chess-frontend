import { Board, Square } from "./board";

export abstract class Piece {
	protected color: Color;
	protected imageSource: string;
	
	constructor(color: Color, imageSource: string) {
		this.color = color;
		this.imageSource = imageSource;
	}

	getColor(): Color {
		return this.color;
	}

	getImageSource(): string {
		return this.imageSource;
	}

	abstract getPossibleMoves(origin: Square, board: Board) : Square[];
}

export class Pawn extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_pawn.png' : 'black_pawn.png');
	}

	override getPossibleMoves(origin: Square, board: Board): Square[] {
		const possibleMoves: Square[] = [];

		//Single forward
		const forwardSquare = this.getForwardSquare(origin);
		if (!board.getPieceOnSquare(forwardSquare)) {
			possibleMoves.push(forwardSquare);
		}

		//Double Forward
		if ((this.color == Color.WHITE && origin.getRank() == 2) || (this.color == Color.BLACK && origin.getRank() == 7)) {
			const doubleForwardSquare = this.getDoubleForwardSquare(origin);
			if (!board.getPieceOnSquare(doubleForwardSquare)) {
				possibleMoves.push(doubleForwardSquare);
			}
		}

		//Capture Left
		if (!(this.color == Color.WHITE && origin.getFile() == 'A') && !(this.color == Color.BLACK && origin.getFile() == 'H')) {
			const forwardLeftSquare = this.getForwardLeftSquare(origin, board);
			if (board.getPieceOnSquare(forwardLeftSquare) && board.getPieceOnSquare(forwardLeftSquare)?.getColor() != this.color) {
				possibleMoves.push(forwardLeftSquare);
			}
		}
	
		//Capture Right
		if (!(this.color == Color.WHITE && origin.getFile() == 'H') && !(this.color == Color.BLACK && origin.getFile() == 'A')) {
			const forwardRightSquare = this.getForwardRightSquare(origin, board);
			if (board.getPieceOnSquare(forwardRightSquare) && board.getPieceOnSquare(forwardRightSquare)?.getColor() != this.color) {
				possibleMoves.push(forwardRightSquare);
			}
		}

		return possibleMoves;
	}

	private getForwardSquare(origin: Square) : Square {
		const file: string = origin.getFile();
		const rank: number = origin.getRank() + (this.color == Color.WHITE ? 1 : -1);
		return new Square(file, rank);
	}

	private getDoubleForwardSquare(origin: Square) : Square {
		const file: string = origin.getFile();
		const rank: number = origin.getRank() + (this.color == Color.WHITE ? 2 : -2);
		return new Square(file, rank);
	}

	private getForwardLeftSquare(origin: Square, board: Board) : Square {
		const file: string = board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + (this.color == Color.WHITE ? -1 : 1));
		const rank: number = origin.getRank() + (this.color == Color.WHITE ? 1 : -1);
		return new Square(file, rank);	
	}

	private getForwardRightSquare(origin: Square, board: Board) : Square {
		const file: string = board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + (this.color == Color.WHITE ? 1 : -1));
		const rank: number = origin.getRank() + (this.color == Color.WHITE ? 1 : -1);
		return new Square(file, rank);	
	}
}

export class Rook extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_rook.png' : 'black_rook.png');
	}

	override getPossibleMoves(origin: Square, board: Board): Square[] {
		return [];
	}
}

export class Knight extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_knight.png' : 'black_knight.png');
	}

	override getPossibleMoves(origin: Square, board: Board): Square[] {
		return [];
	}
}

export class Bishop extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_bishop.png' : 'black_bishop.png');
	}

	override getPossibleMoves(origin: Square, board: Board): Square[] {
		return [];
	}
}

export class Queen extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_queen.png' : 'black_queen.png');
	}

	override getPossibleMoves(origin: Square, board: Board): Square[] {
		return [];
	}
}

export class King extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_king.png' : 'black_king.png');
	}

	override getPossibleMoves(origin: Square, board: Board): Square[] {
		return [];
	}
}

export enum Color {
	WHITE,
	BLACK
}