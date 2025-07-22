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
		const forwardSquare = Board.getNextSquareForward(origin, this.color);
		if (forwardSquare != null && !board.getPieceOnSquare(forwardSquare)) {
			possibleMoves.push(forwardSquare);

			//Double Forward
			if ((this.color == Color.WHITE && origin.getRank() == 2) || (this.color == Color.BLACK && origin.getRank() == 7)) {
				const doubleForwardSquare = Board.getNextSquareForward(forwardSquare, this.color);
				if (doubleForwardSquare != null && !board.getPieceOnSquare(doubleForwardSquare)) {
					possibleMoves.push(doubleForwardSquare);
				}
			}
		}

		//Capture Left
		const captureLeftSquare = Board.getNextSquareForwardLeft(origin, this.color);
		if (captureLeftSquare != null && board.getPieceOnSquare(captureLeftSquare) && board.getPieceOnSquare(captureLeftSquare)?.getColor() != this.color) {
			possibleMoves.push(captureLeftSquare);
		}
	
		//Capture Right
		const captureRightSquare = Board.getNextSquareForwardRight(origin, this.color);
		if (captureRightSquare != null && board.getPieceOnSquare(captureRightSquare) && board.getPieceOnSquare(captureRightSquare)?.getColor() != this.color) {
			possibleMoves.push(captureRightSquare);
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
		let currentForwardSquare = Board.getNextSquareForward(origin, this.color);
		while (currentForwardSquare != null) {
			if (board.getPieceOnSquare(currentForwardSquare)) {
				if (board.getPieceOnSquare(currentForwardSquare)?.getColor() != this.color) {
					possibleMoves.push(currentForwardSquare);
				}
				break;
			}
			possibleMoves.push(currentForwardSquare);
			currentForwardSquare = Board.getNextSquareForward(currentForwardSquare, this.color);
		}

		//Backward
		let currentBackwardSquare = Board.getNextSquareBackward(origin, this.color);
		while (currentBackwardSquare != null) {
			if (board.getPieceOnSquare(currentBackwardSquare)) {
				if (board.getPieceOnSquare(currentBackwardSquare)?.getColor() != this.color) {
					possibleMoves.push(currentBackwardSquare);
				}
				break;
			}
			possibleMoves.push(currentBackwardSquare);
			currentBackwardSquare = Board.getNextSquareBackward(currentBackwardSquare, this.color);
		}

		//Left
		let currentLeftSquare = Board.getNextSquareLeft(origin, this.color);
		while (currentLeftSquare != null) {
			if (board.getPieceOnSquare(currentLeftSquare)) {
				if (board.getPieceOnSquare(currentLeftSquare)?.getColor() != this.color) {
					possibleMoves.push(currentLeftSquare);
				}
				break;
			}
			possibleMoves.push(currentLeftSquare);
			currentLeftSquare = Board.getNextSquareLeft(currentLeftSquare, this.color);
		}

		//Right
		let currentRightSquare = Board.getNextSquareRight(origin, this.color);
		while (currentRightSquare != null) {
			if (board.getPieceOnSquare(currentRightSquare)) {
				if (board.getPieceOnSquare(currentRightSquare)?.getColor() != this.color) {
					possibleMoves.push(currentRightSquare);
				}
				break;
			}
			possibleMoves.push(currentRightSquare);
			currentRightSquare = Board.getNextSquareRight(currentRightSquare, this.color);
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

		//Forward Right Right
		let forwardRightRightSquare = Board.getNextSquareForward(origin, this.color);
		forwardRightRightSquare = forwardRightRightSquare != null ? Board.getNextSquareRight(forwardRightRightSquare, this.color) : null;
		forwardRightRightSquare = forwardRightRightSquare != null ? Board.getNextSquareRight(forwardRightRightSquare, this.color) : null;
		if (forwardRightRightSquare != null && (!board.getPieceOnSquare(forwardRightRightSquare) || board.getPieceOnSquare(forwardRightRightSquare)?.getColor() != this.color)) {
			possibleMoves.push(forwardRightRightSquare);
		}

		//Forward Forward Right
		let forwardForwardRightSquare = Board.getNextSquareForward(origin, this.color);
		forwardForwardRightSquare = forwardForwardRightSquare != null ? Board.getNextSquareForward(forwardForwardRightSquare, this.color) : null;
		forwardForwardRightSquare = forwardForwardRightSquare != null ? Board.getNextSquareRight(forwardForwardRightSquare, this.color) : null;
		if (forwardForwardRightSquare != null && (!board.getPieceOnSquare(forwardForwardRightSquare) || board.getPieceOnSquare(forwardForwardRightSquare)?.getColor() != this.color)) {
			possibleMoves.push(forwardForwardRightSquare);
		}

		//Forward Forward Left
		let forwardForwardLeftSquare = Board.getNextSquareForward(origin, this.color);
		forwardForwardLeftSquare = forwardForwardLeftSquare != null ? Board.getNextSquareForward(forwardForwardLeftSquare, this.color) : null;
		forwardForwardLeftSquare = forwardForwardLeftSquare != null ? Board.getNextSquareLeft(forwardForwardLeftSquare, this.color) : null;
		if (forwardForwardLeftSquare != null && (!board.getPieceOnSquare(forwardForwardLeftSquare) || board.getPieceOnSquare(forwardForwardLeftSquare)?.getColor() != this.color)) {
			possibleMoves.push(forwardForwardLeftSquare);
		}

		//Forward Left Left
		let forwardLeftLeftSquare = Board.getNextSquareForward(origin, this.color);
		forwardLeftLeftSquare = forwardLeftLeftSquare != null ? Board.getNextSquareLeft(forwardLeftLeftSquare, this.color) : null;
		forwardLeftLeftSquare = forwardLeftLeftSquare != null ? Board.getNextSquareLeft(forwardLeftLeftSquare, this.color) : null;
		if (forwardLeftLeftSquare != null && (!board.getPieceOnSquare(forwardLeftLeftSquare) || board.getPieceOnSquare(forwardLeftLeftSquare)?.getColor() != this.color)) {
			possibleMoves.push(forwardLeftLeftSquare);
		}

		//Backward Left Left
		let backwardLeftLeftSquare = Board.getNextSquareBackward(origin, this.color);
		backwardLeftLeftSquare = backwardLeftLeftSquare != null ? Board.getNextSquareLeft(backwardLeftLeftSquare, this.color) : null;
		backwardLeftLeftSquare = backwardLeftLeftSquare != null ? Board.getNextSquareLeft(backwardLeftLeftSquare, this.color) : null;
		if (backwardLeftLeftSquare != null && (!board.getPieceOnSquare(backwardLeftLeftSquare) || board.getPieceOnSquare(backwardLeftLeftSquare)?.getColor() != this.color)) {
			possibleMoves.push(backwardLeftLeftSquare);
		}

		//Backward Backward Left
		let backwardBackwardLeftSquare = Board.getNextSquareBackward(origin, this.color);
		backwardBackwardLeftSquare = backwardBackwardLeftSquare != null ? Board.getNextSquareBackward(backwardBackwardLeftSquare, this.color) : null
		backwardBackwardLeftSquare = backwardBackwardLeftSquare != null ? Board.getNextSquareLeft(backwardBackwardLeftSquare, this.color) : null;
		if (backwardBackwardLeftSquare != null && (!board.getPieceOnSquare(backwardBackwardLeftSquare) || board.getPieceOnSquare(backwardBackwardLeftSquare)?.getColor() != this.color)) {
			possibleMoves.push(backwardBackwardLeftSquare);
		}

		//Backward Backward Right
		let backwardBackwardRightSquare = Board.getNextSquareBackward(origin, this.color);
		backwardBackwardRightSquare = backwardBackwardRightSquare != null ? Board.getNextSquareBackward(backwardBackwardRightSquare, this.color) : null;
		backwardBackwardRightSquare = backwardBackwardRightSquare != null ? Board.getNextSquareRight(backwardBackwardRightSquare, this.color) : null;
		if (backwardBackwardRightSquare != null && (!board.getPieceOnSquare(backwardBackwardRightSquare) || board.getPieceOnSquare(backwardBackwardRightSquare)?.getColor() != this.color)) {
			possibleMoves.push(backwardBackwardRightSquare);
		}

		//Backward Right Right
		let backwardRightRightSquare = Board.getNextSquareBackward(origin, this.color);
		backwardRightRightSquare = backwardRightRightSquare != null ? Board.getNextSquareRight(backwardRightRightSquare, this.color) : null;
		backwardRightRightSquare = backwardRightRightSquare != null ? Board.getNextSquareRight(backwardRightRightSquare!, this.color) : null;
		if (backwardRightRightSquare != null && (!board.getPieceOnSquare(backwardRightRightSquare) || board.getPieceOnSquare(backwardRightRightSquare)?.getColor() != this.color)) {
			possibleMoves.push(backwardRightRightSquare);
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
		let currentForwardRightSquare = Board.getNextSquareForwardRight(origin, this.color);
		while (currentForwardRightSquare != null) {
			if (board.getPieceOnSquare(currentForwardRightSquare)) {
				if (board.getPieceOnSquare(currentForwardRightSquare)?.getColor() != this.color) {
					possibleMoves.push(currentForwardRightSquare);
				}
				break;
			}
			possibleMoves.push(currentForwardRightSquare);
			currentForwardRightSquare = Board.getNextSquareForwardRight(currentForwardRightSquare, this.color);
		}

		//Forward Left
		let currentForwardLeftSquare = Board.getNextSquareForwardLeft(origin, this.color);
		while (currentForwardLeftSquare != null) {
			if (board.getPieceOnSquare(currentForwardLeftSquare)) {
				if (board.getPieceOnSquare(currentForwardLeftSquare)?.getColor() != this.color) {
					possibleMoves.push(currentForwardLeftSquare);
				}
				break;
			}
			possibleMoves.push(currentForwardLeftSquare);
			currentForwardLeftSquare = Board.getNextSquareForwardLeft(currentForwardLeftSquare, this.color);
		}

		//Backward Left
		let currentBackwardLeftSquare = Board.getNextSquareBackwardLeft(origin, this.color);
		while (currentBackwardLeftSquare != null) {
			if (board.getPieceOnSquare(currentBackwardLeftSquare)) {
				if (board.getPieceOnSquare(currentBackwardLeftSquare)?.getColor() != this.color) {
					possibleMoves.push(currentBackwardLeftSquare);
				}
				break;
			}
			possibleMoves.push(currentBackwardLeftSquare);
			currentBackwardLeftSquare = Board.getNextSquareBackwardLeft(currentBackwardLeftSquare, this.color);
		}

		//Backward Right
		let currentBackwardRightSquare = Board.getNextSquareBackwardRight(origin, this.color);
		while (currentBackwardRightSquare != null) {
			if (board.getPieceOnSquare(currentBackwardRightSquare)) {
				if (board.getPieceOnSquare(currentBackwardRightSquare)?.getColor() != this.color) {
					possibleMoves.push(currentBackwardRightSquare);
				}
				break;
			}
			possibleMoves.push(currentBackwardRightSquare);
			currentBackwardRightSquare = Board.getNextSquareBackwardRight(currentBackwardRightSquare, this.color);
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
		let currentForwardSquare = Board.getNextSquareForward(origin, this.color);
		while (currentForwardSquare != null) {
			console.log(currentForwardSquare)
			if (board.getPieceOnSquare(currentForwardSquare)) {
				console.log("HERE")
				if (board.getPieceOnSquare(currentForwardSquare)?.getColor() != this.color) {
					possibleMoves.push(currentForwardSquare);
				}
				break;
			}
			possibleMoves.push(currentForwardSquare);
			currentForwardSquare = Board.getNextSquareForward(currentForwardSquare, this.color);
		}

		//Backward
		let currentBackwardSquare = Board.getNextSquareBackward(origin, this.color);
		while (currentBackwardSquare != null) {
			if (board.getPieceOnSquare(currentBackwardSquare)) {
				if (board.getPieceOnSquare(currentBackwardSquare)?.getColor() != this.color) {
					possibleMoves.push(currentBackwardSquare);
				}
				break;
			}
			possibleMoves.push(currentBackwardSquare);
			currentBackwardSquare = Board.getNextSquareBackward(currentBackwardSquare, this.color);
		}

		//Left
		let currentLeftSquare = Board.getNextSquareLeft(origin, this.color);
		while (currentLeftSquare != null) {
			if (board.getPieceOnSquare(currentLeftSquare)) {
				if (board.getPieceOnSquare(currentLeftSquare)?.getColor() != this.color) {
					possibleMoves.push(currentLeftSquare);
				}
				break;
			}
			possibleMoves.push(currentLeftSquare);
			currentLeftSquare = Board.getNextSquareLeft(currentLeftSquare, this.color);
		}

		//Right
		let currentRightSquare = Board.getNextSquareRight(origin, this.color);
		while (currentRightSquare != null) {
			if (board.getPieceOnSquare(currentRightSquare)) {
				if (board.getPieceOnSquare(currentRightSquare)?.getColor() != this.color) {
					possibleMoves.push(currentRightSquare);
				}
				break;
			}
			possibleMoves.push(currentRightSquare);
			currentRightSquare = Board.getNextSquareRight(currentRightSquare, this.color);
		}

		//Forward Right
		let currentForwardRightSquare = Board.getNextSquareForwardRight(origin, this.color);
		while (currentForwardRightSquare != null) {
			if (board.getPieceOnSquare(currentForwardRightSquare)) {
				if (board.getPieceOnSquare(currentForwardRightSquare)?.getColor() != this.color) {
					possibleMoves.push(currentForwardRightSquare);
				}
				break;
			}
			possibleMoves.push(currentForwardRightSquare);
			currentForwardRightSquare = Board.getNextSquareForwardRight(currentForwardRightSquare, this.color);
		}

		//Forward Left
		let currentForwardLeftSquare = Board.getNextSquareForwardLeft(origin, this.color);
		while (currentForwardLeftSquare != null) {
			if (board.getPieceOnSquare(currentForwardLeftSquare)) {
				if (board.getPieceOnSquare(currentForwardLeftSquare)?.getColor() != this.color) {
					possibleMoves.push(currentForwardLeftSquare);
				}
				break;
			}
			possibleMoves.push(currentForwardLeftSquare);
			currentForwardLeftSquare = Board.getNextSquareForwardLeft(currentForwardLeftSquare, this.color);
		}

		//Backward Left
		let currentBackwardLeftSquare = Board.getNextSquareBackwardLeft(origin, this.color);
		while (currentBackwardLeftSquare != null) {
			if (board.getPieceOnSquare(currentBackwardLeftSquare)) {
				if (board.getPieceOnSquare(currentBackwardLeftSquare)?.getColor() != this.color) {
					possibleMoves.push(currentBackwardLeftSquare);
				}
				break;
			}
			possibleMoves.push(currentBackwardLeftSquare);
			currentBackwardLeftSquare = Board.getNextSquareBackwardLeft(currentBackwardLeftSquare, this.color);
		}

		//Backward Right
		let currentBackwardRightSquare = Board.getNextSquareBackwardRight(origin, this.color);
		while (currentBackwardRightSquare != null) {
			if (board.getPieceOnSquare(currentBackwardRightSquare)) {
				if (board.getPieceOnSquare(currentBackwardRightSquare)?.getColor() != this.color) {
					possibleMoves.push(currentBackwardRightSquare);
				}
				break;
			}
			possibleMoves.push(currentBackwardRightSquare);
			currentBackwardRightSquare = Board.getNextSquareBackwardRight(currentBackwardRightSquare, this.color);
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
		const forwardSquare = Board.getNextSquareForward(origin, this.color);
		if (forwardSquare != null && (!board.getPieceOnSquare(forwardSquare) || board.getPieceOnSquare(forwardSquare)?.getColor() != this.color)) {
			possibleMoves.push(forwardSquare);
		}

		//Backward
		const backwardSquare = Board.getNextSquareBackward(origin, this.color);
		if (backwardSquare != null && (!board.getPieceOnSquare(backwardSquare) || board.getPieceOnSquare(backwardSquare)?.getColor() != this.color)) {
			possibleMoves.push(backwardSquare);
		}

		//Left
		const leftSquare = Board.getNextSquareLeft(origin, this.color);
		if (leftSquare != null && (!board.getPieceOnSquare(leftSquare) || board.getPieceOnSquare(leftSquare)?.getColor() != this.color)) {
			possibleMoves.push(leftSquare);
		}

		//Right
		const rightSquare = Board.getNextSquareRight(origin, this.color);
		if (rightSquare != null && (!board.getPieceOnSquare(rightSquare) || board.getPieceOnSquare(rightSquare)?.getColor() != this.color)) {
			possibleMoves.push(rightSquare);
		}

		//Forward Right
		const forwardRightSquare = Board.getNextSquareForwardRight(origin, this.color);
		if (forwardRightSquare != null && (!board.getPieceOnSquare(forwardRightSquare) || board.getPieceOnSquare(forwardRightSquare)?.getColor() != this.color)) {
			possibleMoves.push(forwardRightSquare);
		}

		//Forward Left
		const forwardLeftSquare = Board.getNextSquareForwardLeft(origin, this.color);
		if (forwardLeftSquare != null && (!board.getPieceOnSquare(forwardLeftSquare) || board.getPieceOnSquare(forwardLeftSquare)?.getColor() != this.color)) {
			possibleMoves.push(forwardLeftSquare);
		}

		//Backward Left
		const backwardLeftSquare = Board.getNextSquareBackwardLeft(origin, this.color);
		if (backwardLeftSquare != null && (!board.getPieceOnSquare(backwardLeftSquare) || board.getPieceOnSquare(backwardLeftSquare)?.getColor() != this.color)) {
			possibleMoves.push(backwardLeftSquare);
		}

		//Backward Right
		const backwardRightSquare = Board.getNextSquareBackwardRight(origin, this.color);
		if (backwardRightSquare != null && (!board.getPieceOnSquare(backwardRightSquare) || board.getPieceOnSquare(backwardRightSquare)?.getColor() != this.color)) {
			possibleMoves.push(backwardRightSquare);
		}

		return possibleMoves;
	}
}

export enum Color {
	WHITE,
	BLACK
}