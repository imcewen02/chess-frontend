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
		const square = new Square(origin.getFile(), origin.getRank() + (this.color == Color.WHITE ? 1 : -1));
		if (!board.getPieceOnSquare(square)) {
			possibleMoves.push(square);
		}

		//Double Forward
		if ((this.color == Color.WHITE && origin.getRank() == 2) || (this.color == Color.BLACK && origin.getRank() == 7)) {
			const square = new Square(origin.getFile(), origin.getRank() + (this.color == Color.WHITE ? 2 : -2));
			if (!board.getPieceOnSquare(square)) {
				possibleMoves.push(square);
			}
		}

		//Capture Left
		if (!(this.color == Color.WHITE && origin.getFile() == 'A') && !(this.color == Color.BLACK && origin.getFile() == 'H')) {
			const square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + (this.color == Color.WHITE ? -1 : 1)), origin.getRank() + (this.color == Color.WHITE ? 1 : -1));
			if (board.getPieceOnSquare(square) && board.getPieceOnSquare(square)?.getColor() != this.color) {
				possibleMoves.push(square);
			}
		}
	
		//Capture Right
		if (!(this.color == Color.WHITE && origin.getFile() == 'H') && !(this.color == Color.BLACK && origin.getFile() == 'A')) {
			const square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + (this.color == Color.WHITE ? 1 : -1)), origin.getRank() + (this.color == Color.WHITE ? 1 : -1));
			if (board.getPieceOnSquare(square) && board.getPieceOnSquare(square)?.getColor() != this.color) {
				possibleMoves.push(square);
			}
		}

		return possibleMoves;
	}
}

export class Rook extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_rook.png' : 'black_rook.png');
	}

	override getPossibleMoves(origin: Square, board: Board): Square[] {
		const possibleMoves: Square[] = [];

		//Forward
		for (let rank = origin.getRank() + 1; rank <= 8; rank++) {
			const square = new Square(origin.getFile(), rank);
			if (board.getPieceOnSquare(square)) {
				if (board.getPieceOnSquare(square)?.getColor() != this.color) {
					possibleMoves.push(square);
				}
				break;
			}
			possibleMoves.push(square);
		}

		//Backward
		for (let rank = origin.getRank() - 1; rank >= 1; rank--) {
			const square = new Square(origin.getFile(), rank);
			if (board.getPieceOnSquare(square)) {
				if (board.getPieceOnSquare(square)?.getColor() != this.color) {
					possibleMoves.push(square);
				}
				break;
			}
			possibleMoves.push(square);
		}

		//Left
		for (let file = board.getFileAsNumber(origin.getFile()) + 1; file <= 8; file++) {
			const square = new Square(board.getNumberAsFile(file), origin.getRank());
			if (board.getPieceOnSquare(square)) {
				if (board.getPieceOnSquare(square)?.getColor() != this.color) {
					possibleMoves.push(square);
				}
				break;
			}
			possibleMoves.push(square);
		}

		//Right
		for (let file = board.getFileAsNumber(origin.getFile()) - 1; file >= 1; file--) {
			const square = new Square(board.getNumberAsFile(file), origin.getRank());
			if (board.getPieceOnSquare(square)) {
				if (board.getPieceOnSquare(square)?.getColor() != this.color) {
					possibleMoves.push(square);
				}
				break;
			}
			possibleMoves.push(square);
		}

		return possibleMoves;
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