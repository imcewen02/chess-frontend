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
		let square = new Square(origin.getFile(), origin.getRank() + (this.color == Color.WHITE ? 1 : -1));
		if (!board.getPieceOnSquare(square)) {
			possibleMoves.push(square);
		}

		//Double Forward
		if ((this.color == Color.WHITE && origin.getRank() == 2) || (this.color == Color.BLACK && origin.getRank() == 7)) {
			square = new Square(origin.getFile(), origin.getRank() + (this.color == Color.WHITE ? 2 : -2));
			if (!board.getPieceOnSquare(square)) {
				possibleMoves.push(square);
			}
		}

		//Capture Left
		square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + (this.color == Color.WHITE ? -1 : 1)), origin.getRank() + (this.color == Color.WHITE ? 1 : -1));
		if (board.getPieceOnSquare(square) && board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}
	
		//Capture Right
		square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + (this.color == Color.WHITE ? 1 : -1)), origin.getRank() + (this.color == Color.WHITE ? 1 : -1));
		if (board.getPieceOnSquare(square) && board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		//TODO: En passant

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

		//TODO: Castling

		return possibleMoves;
	}
}

export class Knight extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_knight.png' : 'black_knight.png');
	}

	override getPossibleMoves(origin: Square, board: Board): Square[] {
		const possibleMoves: Square[] = [];

		//Forward Forward Right
		let square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + 1), origin.getRank() + 2);
		if (!board.getPieceOnSquare(square) || board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		//Forward Forward Left
		square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) - 1), origin.getRank() + 2);
		if (!board.getPieceOnSquare(square) || board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		//Forward Left Left
		square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) - 2), origin.getRank() + 1);
		if (!board.getPieceOnSquare(square) || board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		//Backward Left Left
		square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) - 2), origin.getRank() - 1);
		if (!board.getPieceOnSquare(square) || board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		//Backward Backward Left
		square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) - 1), origin.getRank() - 2);
		if (!board.getPieceOnSquare(square) || board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		//Backward Backward Right
		square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + 1), origin.getRank() - 2);
		if (!board.getPieceOnSquare(square) || board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		//Backward Right Right
		square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + 2), origin.getRank() - 1);
		if (!board.getPieceOnSquare(square) || board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		//Forward Right Right
		square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + 2), origin.getRank() + 1);
		if (!board.getPieceOnSquare(square) || board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		return possibleMoves;
	}
}

export class Bishop extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_bishop.png' : 'black_bishop.png');
	}

	override getPossibleMoves(origin: Square, board: Board): Square[] {
		const possibleMoves: Square[] = [];

		//Forward Right
		let index = 1;
		while (origin.getRank() + index <= 8 && board.getFileAsNumber(origin.getFile()) + index <= 8) {
			const square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + index), origin.getRank() + index);
			if (board.getPieceOnSquare(square)) {
				if (board.getPieceOnSquare(square)?.getColor() != this.color) {
					possibleMoves.push(square);
				}
				break;
			}
			possibleMoves.push(square);
			index++;
		}

		//Forward Left
		index = 1;
		while (origin.getRank() + index <= 8 && board.getFileAsNumber(origin.getFile()) - index >= 1) {
			const square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) - index), origin.getRank() + index);
			if (board.getPieceOnSquare(square)) {
				if (board.getPieceOnSquare(square)?.getColor() != this.color) {
					possibleMoves.push(square);
				}
				break;
			}
			possibleMoves.push(square);
			index++;
		}

		//Backward Left
		index = 1;
		while (origin.getRank() - index >= 1 && board.getFileAsNumber(origin.getFile()) - index >= 1) {
			const square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) - index), origin.getRank() - index);
			if (board.getPieceOnSquare(square)) {
				if (board.getPieceOnSquare(square)?.getColor() != this.color) {
					possibleMoves.push(square);
				}
				break;
			}
			possibleMoves.push(square);
			index++;
		}

		//Backward Right
		index = 1;
		while (origin.getRank() - index >= 1 && board.getFileAsNumber(origin.getFile()) + index <= 8) {
			const square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + index), origin.getRank() - index);
			if (board.getPieceOnSquare(square)) {
				if (board.getPieceOnSquare(square)?.getColor() != this.color) {
					possibleMoves.push(square);
				}
				break;
			}
			possibleMoves.push(square);
			index++;
		}

		return possibleMoves;
	}
}

export class Queen extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_queen.png' : 'black_queen.png');
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

		//Forward Right
		let index = 1;
		while (origin.getRank() + index <= 8 && board.getFileAsNumber(origin.getFile()) + index <= 8) {
			const square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + index), origin.getRank() + index);
			if (board.getPieceOnSquare(square)) {
				if (board.getPieceOnSquare(square)?.getColor() != this.color) {
					possibleMoves.push(square);
				}
				break;
			}
			possibleMoves.push(square);
			index++;
		}

		//Forward Left
		index = 1;
		while (origin.getRank() + index <= 8 && board.getFileAsNumber(origin.getFile()) - index >= 1) {
			const square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) - index), origin.getRank() + index);
			if (board.getPieceOnSquare(square)) {
				if (board.getPieceOnSquare(square)?.getColor() != this.color) {
					possibleMoves.push(square);
				}
				break;
			}
			possibleMoves.push(square);
			index++;
		}

		//Backward Left
		index = 1;
		while (origin.getRank() - index >= 1 && board.getFileAsNumber(origin.getFile()) - index >= 1) {
			const square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) - index), origin.getRank() - index);
			if (board.getPieceOnSquare(square)) {
				if (board.getPieceOnSquare(square)?.getColor() != this.color) {
					possibleMoves.push(square);
				}
				break;
			}
			possibleMoves.push(square);
			index++;
		}

		//Backward Right
		index = 1;
		while (origin.getRank() - index >= 1 && board.getFileAsNumber(origin.getFile()) + index <= 8) {
			const square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + index), origin.getRank() - index);
			if (board.getPieceOnSquare(square)) {
				if (board.getPieceOnSquare(square)?.getColor() != this.color) {
					possibleMoves.push(square);
				}
				break;
			}
			possibleMoves.push(square);
			index++;
		}

		return possibleMoves;
	}
}

export class King extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_king.png' : 'black_king.png');
	}

	override getPossibleMoves(origin: Square, board: Board): Square[] {
		const possibleMoves: Square[] = [];

		//Forward
		let square = new Square(origin.getFile(), origin.getRank() + 1);
		if (!board.getPieceOnSquare(square) || board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		//Backward
		square = new Square(origin.getFile(), origin.getRank() - 1);
		if (!board.getPieceOnSquare(square) || board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		//Left
		square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) - 1), origin.getRank());
		if (!board.getPieceOnSquare(square) || board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		//Right
		square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + 1), origin.getRank());
		if (!board.getPieceOnSquare(square) || board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		//Forward Right
		square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + 1), origin.getRank() + 1);
		if (!board.getPieceOnSquare(square) || board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		//Forward Left
		square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) - 1), origin.getRank() + 1);
		if (!board.getPieceOnSquare(square) || board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		//Backward Left
		square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) - 1), origin.getRank() - 1);
		if (!board.getPieceOnSquare(square) || board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		//Backward Right
		square = new Square(board.getNumberAsFile(board.getFileAsNumber(origin.getFile()) + 1), origin.getRank() - 1);
		if (!board.getPieceOnSquare(square) || board.getPieceOnSquare(square)?.getColor() != this.color) {
			possibleMoves.push(square);
		}

		return possibleMoves;
	}
}

export enum Color {
	WHITE,
	BLACK
}