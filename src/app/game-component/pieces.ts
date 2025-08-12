import { Board } from "./board";

export abstract class Piece {
	protected color: 'white' | 'black';
	protected name: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
	
	constructor(color: 'white' | 'black', name: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king') {
		this.color = color;
		this.name = name;
	}

	getColor(): 'white' | 'black' {
		return this.color;
	}

	getName(): 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king' {
		return this.name;
	}

	getImageSource(): string {
		return this.color + '_' + this.name + '.png';
	}

	abstract getPossibleMovesFromSquare(file: string, rank: number, board: Board, checkForCausingMate: boolean) : {file: string, rank: number}[];
}

export class Pawn extends Piece {
	constructor(color: 'white' | 'black') {
		super(color, 'pawn');
	}

	override getPossibleMovesFromSquare(file: string, rank: number, board: Board, checkForCausingMate: boolean): {file: string, rank: number}[] {
		const possibleMoves: {file: string, rank: number}[] = [];

		//Single forward
		const forwardSquare = board.getNextSquareForward(file, rank, this.color);
		if (forwardSquare && !board.getPieceOnSquare(forwardSquare.file, forwardSquare.rank)) {
			possibleMoves.push({file: forwardSquare.file, rank: forwardSquare.rank});

			//Double Forward
			if ((this.color == 'white' && rank == 2) || (this.color == 'black' && rank == 7)) {
				const doubleForwardSquare = board.getNextSquareForward(forwardSquare.file, forwardSquare.rank, this.color);
				if (doubleForwardSquare && !board.getPieceOnSquare(doubleForwardSquare.file, doubleForwardSquare.rank)) {
					possibleMoves.push(doubleForwardSquare);
				}
			}
		}

		//Capture Left
		const captureLeftSquare = board.getNextSquareForwardLeft(file, rank, this.color);
		if (captureLeftSquare != null && board.getPieceOnSquare(captureLeftSquare.file, captureLeftSquare.rank) != null && board.getPieceOnSquare(captureLeftSquare.file, captureLeftSquare.rank)?.getColor() != this.color) {
			possibleMoves.push(captureLeftSquare);
		}
	
		//Capture Right
		const captureRightSquare = board.getNextSquareForwardRight(file, rank, this.color);
		if (captureRightSquare != null && board.getPieceOnSquare(captureRightSquare.file, captureRightSquare.rank) != null && board.getPieceOnSquare(captureRightSquare.file, captureRightSquare.rank)?.getColor() != this.color) {
			possibleMoves.push(captureRightSquare);
		}

		//TODO: En passant

		return checkForCausingMate ? possibleMoves.filter( move => !board.isMoveIllegal(file, rank, move.file, move.rank)) : possibleMoves;
	}
}

export class Rook extends Piece {
	constructor(color: 'white' | 'black') {
		super(color, 'rook');
	}

	override getPossibleMovesFromSquare(file: string, rank: number, board: Board, checkForCausingMate: boolean): {file: string, rank: number}[] {
		const possibleMoves: {file: string, rank: number}[] = [];

		//Forward
		let currentForwardSquare = board.getNextSquareForward(file, rank, this.color);
		while (currentForwardSquare != null) {
			if (board.getPieceOnSquare(currentForwardSquare.file, currentForwardSquare.rank)) {
				if (board.getPieceOnSquare(currentForwardSquare.file, currentForwardSquare.rank)?.getColor() != this.color) {
					possibleMoves.push(currentForwardSquare);
				}
				break;
			}
			possibleMoves.push(currentForwardSquare);
			currentForwardSquare = board.getNextSquareForward(currentForwardSquare.file, currentForwardSquare.rank, this.color);
		}

		//Backward
		let currentBackwardSquare = board.getNextSquareBackward(file, rank, this.color);
		while (currentBackwardSquare != null) {
			if (board.getPieceOnSquare(currentBackwardSquare.file, currentBackwardSquare.rank)) {
				if (board.getPieceOnSquare(currentBackwardSquare.file, currentBackwardSquare.rank)?.getColor() != this.color) {
					possibleMoves.push(currentBackwardSquare);
				}
				break;
			}
			possibleMoves.push(currentBackwardSquare);
			currentBackwardSquare = board.getNextSquareBackward(currentBackwardSquare.file, currentBackwardSquare.rank, this.color);
		}

		//Left
		let currentLeftSquare = board.getNextSquareLeft(file, rank, this.color);
		while (currentLeftSquare != null) {
			if (board.getPieceOnSquare(currentLeftSquare.file, currentLeftSquare.rank)) {
				if (board.getPieceOnSquare(currentLeftSquare.file, currentLeftSquare.rank)?.getColor() != this.color) {
					possibleMoves.push(currentLeftSquare);
				}
				break;
			}
			possibleMoves.push(currentLeftSquare);
			currentLeftSquare = board.getNextSquareLeft(currentLeftSquare.file, currentLeftSquare.rank, this.color);
		}

		//Right
		let currentRightSquare = board.getNextSquareRight(file, rank, this.color);
		while (currentRightSquare != null) {
			if (board.getPieceOnSquare(currentRightSquare.file, currentRightSquare.rank)) {
				if (board.getPieceOnSquare(currentRightSquare.file, currentRightSquare.rank)?.getColor() != this.color) {
					possibleMoves.push(currentRightSquare);
				}
				break;
			}
			possibleMoves.push(currentRightSquare);
			currentRightSquare = board.getNextSquareRight(currentRightSquare.file, currentRightSquare.rank, this.color);
		}

		//TODO: Castling

		return checkForCausingMate ? possibleMoves.filter( move => !board.isMoveIllegal(file, rank, move.file, move.rank)) : possibleMoves;
	}
}

export class Knight extends Piece {
	constructor(color: 'white' | 'black') {
		super(color, 'knight');
	}

	override getPossibleMovesFromSquare(file: string, rank: number, board: Board, checkForCausingMate: boolean): {file: string, rank: number}[] {
		const possibleMoves: {file: string, rank: number}[] = [];

		//Forward Right Right
		let forwardRightRightSquare = board.getNextSquareForward(file, rank, this.color);
		forwardRightRightSquare = forwardRightRightSquare != null ? board.getNextSquareRight(forwardRightRightSquare.file, forwardRightRightSquare.rank, this.color) : null;
		forwardRightRightSquare = forwardRightRightSquare != null ? board.getNextSquareRight(forwardRightRightSquare.file, forwardRightRightSquare.rank, this.color) : null;
		if (forwardRightRightSquare != null && (!board.getPieceOnSquare(forwardRightRightSquare.file, forwardRightRightSquare.rank) || board.getPieceOnSquare(forwardRightRightSquare.file, forwardRightRightSquare.rank)?.getColor() != this.color)) {
			possibleMoves.push(forwardRightRightSquare);
		}

		//Forward Forward Right
		let forwardForwardRightSquare = board.getNextSquareForward(file, rank, this.color);
		forwardForwardRightSquare = forwardForwardRightSquare != null ? board.getNextSquareForward(forwardForwardRightSquare.file, forwardForwardRightSquare.rank, this.color) : null;
		forwardForwardRightSquare = forwardForwardRightSquare != null ? board.getNextSquareRight(forwardForwardRightSquare.file, forwardForwardRightSquare.rank, this.color) : null;
		if (forwardForwardRightSquare != null && (!board.getPieceOnSquare(forwardForwardRightSquare.file, forwardForwardRightSquare.rank) || board.getPieceOnSquare(forwardForwardRightSquare.file, forwardForwardRightSquare.rank)?.getColor() != this.color)) {
			possibleMoves.push(forwardForwardRightSquare);
		}

		//Forward Forward Left
		let forwardForwardLeftSquare = board.getNextSquareForward(file, rank, this.color);
		forwardForwardLeftSquare = forwardForwardLeftSquare != null ? board.getNextSquareForward(forwardForwardLeftSquare.file, forwardForwardLeftSquare.rank, this.color) : null;
		forwardForwardLeftSquare = forwardForwardLeftSquare != null ? board.getNextSquareLeft(forwardForwardLeftSquare.file, forwardForwardLeftSquare.rank, this.color) : null;
		if (forwardForwardLeftSquare != null && (!board.getPieceOnSquare(forwardForwardLeftSquare.file, forwardForwardLeftSquare.rank) || board.getPieceOnSquare(forwardForwardLeftSquare.file, forwardForwardLeftSquare.rank)?.getColor() != this.color)) {
			possibleMoves.push(forwardForwardLeftSquare);
		}

		//Forward Left Left
		let forwardLeftLeftSquare = board.getNextSquareForward(file, rank, this.color);
		forwardLeftLeftSquare = forwardLeftLeftSquare != null ? board.getNextSquareLeft(forwardLeftLeftSquare.file, forwardLeftLeftSquare.rank, this.color) : null;
		forwardLeftLeftSquare = forwardLeftLeftSquare != null ? board.getNextSquareLeft(forwardLeftLeftSquare.file, forwardLeftLeftSquare.rank, this.color) : null;
		if (forwardLeftLeftSquare != null && (!board.getPieceOnSquare(forwardLeftLeftSquare.file, forwardLeftLeftSquare.rank) || board.getPieceOnSquare(forwardLeftLeftSquare.file, forwardLeftLeftSquare.rank)?.getColor() != this.color)) {
			possibleMoves.push(forwardLeftLeftSquare);
		}

		//Backward Left Left
		let backwardLeftLeftSquare = board.getNextSquareBackward(file, rank, this.color);
		backwardLeftLeftSquare = backwardLeftLeftSquare != null ? board.getNextSquareLeft(backwardLeftLeftSquare.file, backwardLeftLeftSquare.rank, this.color) : null;
		backwardLeftLeftSquare = backwardLeftLeftSquare != null ? board.getNextSquareLeft(backwardLeftLeftSquare.file, backwardLeftLeftSquare.rank, this.color) : null;
		if (backwardLeftLeftSquare != null && (!board.getPieceOnSquare(backwardLeftLeftSquare.file, backwardLeftLeftSquare.rank) || board.getPieceOnSquare(backwardLeftLeftSquare.file, backwardLeftLeftSquare.rank)?.getColor() != this.color)) {
			possibleMoves.push(backwardLeftLeftSquare);
		}

		//Backward Backward Left
		let backwardBackwardLeftSquare = board.getNextSquareBackward(file, rank, this.color);
		backwardBackwardLeftSquare = backwardBackwardLeftSquare != null ? board.getNextSquareBackward(backwardBackwardLeftSquare.file, backwardBackwardLeftSquare.rank, this.color) : null
		backwardBackwardLeftSquare = backwardBackwardLeftSquare != null ? board.getNextSquareLeft(backwardBackwardLeftSquare.file, backwardBackwardLeftSquare.rank, this.color) : null;
		if (backwardBackwardLeftSquare != null && (!board.getPieceOnSquare(backwardBackwardLeftSquare.file, backwardBackwardLeftSquare.rank) || board.getPieceOnSquare(backwardBackwardLeftSquare.file, backwardBackwardLeftSquare.rank)?.getColor() != this.color)) {
			possibleMoves.push(backwardBackwardLeftSquare);
		}

		//Backward Backward Right
		let backwardBackwardRightSquare = board.getNextSquareBackward(file, rank, this.color);
		backwardBackwardRightSquare = backwardBackwardRightSquare != null ? board.getNextSquareBackward(backwardBackwardRightSquare.file, backwardBackwardRightSquare.rank, this.color) : null;
		backwardBackwardRightSquare = backwardBackwardRightSquare != null ? board.getNextSquareRight(backwardBackwardRightSquare.file, backwardBackwardRightSquare.rank, this.color) : null;
		if (backwardBackwardRightSquare != null && (!board.getPieceOnSquare(backwardBackwardRightSquare.file, backwardBackwardRightSquare.rank) || board.getPieceOnSquare(backwardBackwardRightSquare.file, backwardBackwardRightSquare.rank)?.getColor() != this.color)) {
			possibleMoves.push(backwardBackwardRightSquare);
		}

		//Backward Right Right
		let backwardRightRightSquare = board.getNextSquareBackward(file, rank, this.color);
		backwardRightRightSquare = backwardRightRightSquare != null ? board.getNextSquareRight(backwardRightRightSquare.file, backwardRightRightSquare.rank, this.color) : null;
		backwardRightRightSquare = backwardRightRightSquare != null ? board.getNextSquareRight(backwardRightRightSquare.file, backwardRightRightSquare.rank, this.color) : null;
		if (backwardRightRightSquare != null && (!board.getPieceOnSquare(backwardRightRightSquare.file, backwardRightRightSquare.rank) || board.getPieceOnSquare(backwardRightRightSquare.file, backwardRightRightSquare.rank)?.getColor() != this.color)) {
			possibleMoves.push(backwardRightRightSquare);
		}

		return checkForCausingMate ? possibleMoves.filter( move => !board.isMoveIllegal(file, rank, move.file, move.rank)) : possibleMoves;
	}
}

export class Bishop extends Piece {
	constructor(color: 'white' | 'black') {
		super(color, 'bishop');
	}

	override getPossibleMovesFromSquare(file: string, rank: number, board: Board, checkForCausingMate: boolean): {file: string, rank: number}[] {
		const possibleMoves: {file: string, rank: number}[] = [];

		//Forward Right
		let currentForwardRightSquare = board.getNextSquareForwardRight(file, rank, this.color);
		while (currentForwardRightSquare != null) {
			if (board.getPieceOnSquare(currentForwardRightSquare.file, currentForwardRightSquare.rank)) {
				if (board.getPieceOnSquare(currentForwardRightSquare.file, currentForwardRightSquare.rank)?.getColor() != this.color) {
					possibleMoves.push(currentForwardRightSquare);
				}
				break;
			}
			possibleMoves.push(currentForwardRightSquare);
			currentForwardRightSquare = board.getNextSquareForwardRight(currentForwardRightSquare.file, currentForwardRightSquare.rank, this.color);
		}

		//Forward Left
		let currentForwardLeftSquare = board.getNextSquareForwardLeft(file, rank, this.color);
		while (currentForwardLeftSquare != null) {
			if (board.getPieceOnSquare(currentForwardLeftSquare.file, currentForwardLeftSquare.rank)) {
				if (board.getPieceOnSquare(currentForwardLeftSquare.file, currentForwardLeftSquare.rank)?.getColor() != this.color) {
					possibleMoves.push(currentForwardLeftSquare);
				}
				break;
			}
			possibleMoves.push(currentForwardLeftSquare);
			currentForwardLeftSquare = board.getNextSquareForwardLeft(currentForwardLeftSquare.file, currentForwardLeftSquare.rank, this.color);
		}

		//Backward Left
		let currentBackwardLeftSquare = board.getNextSquareBackwardLeft(file, rank, this.color);
		while (currentBackwardLeftSquare != null) {
			if (board.getPieceOnSquare(currentBackwardLeftSquare.file, currentBackwardLeftSquare.rank)) {
				if (board.getPieceOnSquare(currentBackwardLeftSquare.file, currentBackwardLeftSquare.rank)?.getColor() != this.color) {
					possibleMoves.push(currentBackwardLeftSquare);
				}
				break;
			}
			possibleMoves.push(currentBackwardLeftSquare);
			currentBackwardLeftSquare = board.getNextSquareBackwardLeft(currentBackwardLeftSquare.file, currentBackwardLeftSquare.rank, this.color);
		}

		//Backward Right
		let currentBackwardRightSquare = board.getNextSquareBackwardRight(file, rank, this.color);
		while (currentBackwardRightSquare != null) {
			if (board.getPieceOnSquare(currentBackwardRightSquare.file, currentBackwardRightSquare.rank)) {
				if (board.getPieceOnSquare(currentBackwardRightSquare.file, currentBackwardRightSquare.rank)?.getColor() != this.color) {
					possibleMoves.push(currentBackwardRightSquare);
				}
				break;
			}
			possibleMoves.push(currentBackwardRightSquare);
			currentBackwardRightSquare = board.getNextSquareBackwardRight(currentBackwardRightSquare.file, currentBackwardRightSquare.rank, this.color);
		}

		return checkForCausingMate ? possibleMoves.filter( move => !board.isMoveIllegal(file, rank, move.file, move.rank)) : possibleMoves;
	}
}

export class Queen extends Piece {
	constructor(color: 'white' | 'black') {
		super(color, 'queen');
	}

	override getPossibleMovesFromSquare(file: string, rank: number, board: Board, checkForCausingMate: boolean): {file: string, rank: number}[] {
		const possibleMoves: {file: string, rank: number}[] = [];

		//Forward
		let currentForwardSquare = board.getNextSquareForward(file, rank, this.color);
		while (currentForwardSquare != null) {
			if (board.getPieceOnSquare(currentForwardSquare.file, currentForwardSquare.rank)) {
				if (board.getPieceOnSquare(currentForwardSquare.file, currentForwardSquare.rank)?.getColor() != this.color) {
					possibleMoves.push(currentForwardSquare);
				}
				break;
			}
			possibleMoves.push(currentForwardSquare);
			currentForwardSquare = board.getNextSquareForward(currentForwardSquare.file, currentForwardSquare.rank, this.color);
		}

		//Backward
		let currentBackwardSquare = board.getNextSquareBackward(file, rank, this.color);
		while (currentBackwardSquare != null) {
			if (board.getPieceOnSquare(currentBackwardSquare.file, currentBackwardSquare.rank)) {
				if (board.getPieceOnSquare(currentBackwardSquare.file, currentBackwardSquare.rank)?.getColor() != this.color) {
					possibleMoves.push(currentBackwardSquare);
				}
				break;
			}
			possibleMoves.push(currentBackwardSquare);
			currentBackwardSquare = board.getNextSquareBackward(currentBackwardSquare.file, currentBackwardSquare.rank, this.color);
		}

		//Left
		let currentLeftSquare = board.getNextSquareLeft(file, rank, this.color);
		while (currentLeftSquare != null) {
			if (board.getPieceOnSquare(currentLeftSquare.file, currentLeftSquare.rank)) {
				if (board.getPieceOnSquare(currentLeftSquare.file, currentLeftSquare.rank)?.getColor() != this.color) {
					possibleMoves.push(currentLeftSquare);
				}
				break;
			}
			possibleMoves.push(currentLeftSquare);
			currentLeftSquare = board.getNextSquareLeft(currentLeftSquare.file, currentLeftSquare.rank, this.color);
		}

		//Right
		let currentRightSquare = board.getNextSquareRight(file, rank, this.color);
		while (currentRightSquare != null) {
			if (board.getPieceOnSquare(currentRightSquare.file, currentRightSquare.rank)) {
				if (board.getPieceOnSquare(currentRightSquare.file, currentRightSquare.rank)?.getColor() != this.color) {
					possibleMoves.push(currentRightSquare);
				}
				break;
			}
			possibleMoves.push(currentRightSquare);
			currentRightSquare = board.getNextSquareRight(currentRightSquare.file, currentRightSquare.rank, this.color);
		}

		//Forward Right
		let currentForwardRightSquare = board.getNextSquareForwardRight(file, rank, this.color);
		while (currentForwardRightSquare != null) {
			if (board.getPieceOnSquare(currentForwardRightSquare.file, currentForwardRightSquare.rank)) {
				if (board.getPieceOnSquare(currentForwardRightSquare.file, currentForwardRightSquare.rank)?.getColor() != this.color) {
					possibleMoves.push(currentForwardRightSquare);
				}
				break;
			}
			possibleMoves.push(currentForwardRightSquare);
			currentForwardRightSquare = board.getNextSquareForwardRight(currentForwardRightSquare.file, currentForwardRightSquare.rank, this.color);
		}

		//Forward Left
		let currentForwardLeftSquare = board.getNextSquareForwardLeft(file, rank, this.color);
		while (currentForwardLeftSquare != null) {
			if (board.getPieceOnSquare(currentForwardLeftSquare.file, currentForwardLeftSquare.rank)) {
				if (board.getPieceOnSquare(currentForwardLeftSquare.file, currentForwardLeftSquare.rank)?.getColor() != this.color) {
					possibleMoves.push(currentForwardLeftSquare);
				}
				break;
			}
			possibleMoves.push(currentForwardLeftSquare);
			currentForwardLeftSquare = board.getNextSquareForwardLeft(currentForwardLeftSquare.file, currentForwardLeftSquare.rank, this.color);
		}

		//Backward Left
		let currentBackwardLeftSquare = board.getNextSquareBackwardLeft(file, rank, this.color);
		while (currentBackwardLeftSquare != null) {
			if (board.getPieceOnSquare(currentBackwardLeftSquare.file, currentBackwardLeftSquare.rank)) {
				if (board.getPieceOnSquare(currentBackwardLeftSquare.file, currentBackwardLeftSquare.rank)?.getColor() != this.color) {
					possibleMoves.push(currentBackwardLeftSquare);
				}
				break;
			}
			possibleMoves.push(currentBackwardLeftSquare);
			currentBackwardLeftSquare = board.getNextSquareBackwardLeft(currentBackwardLeftSquare.file, currentBackwardLeftSquare.rank, this.color);
		}

		//Backward Right
		let currentBackwardRightSquare = board.getNextSquareBackwardRight(file, rank, this.color);
		while (currentBackwardRightSquare != null) {
			if (board.getPieceOnSquare(currentBackwardRightSquare.file, currentBackwardRightSquare.rank)) {
				if (board.getPieceOnSquare(currentBackwardRightSquare.file, currentBackwardRightSquare.rank)?.getColor() != this.color) {
					possibleMoves.push(currentBackwardRightSquare);
				}
				break;
			}
			possibleMoves.push(currentBackwardRightSquare);
			currentBackwardRightSquare = board.getNextSquareBackwardRight(currentBackwardRightSquare.file, currentBackwardRightSquare.rank, this.color);
		}

		return checkForCausingMate ? possibleMoves.filter( move => !board.isMoveIllegal(file, rank, move.file, move.rank)) : possibleMoves;
	}
}

export class King extends Piece {
	constructor(color: 'white' | 'black') {
		super(color, 'king');
	}

	override getPossibleMovesFromSquare(file: string, rank: number, board: Board, checkForCausingMate: boolean): {file: string, rank: number}[] {
		const possibleMoves: {file: string, rank: number}[] = [];

		//Forward
		const forwardSquare = board.getNextSquareForward(file, rank, this.color);
		if (forwardSquare != null && (!board.getPieceOnSquare(forwardSquare.file, forwardSquare.rank) || board.getPieceOnSquare(forwardSquare.file, forwardSquare.rank)?.getColor() != this.color)) {
			possibleMoves.push(forwardSquare);
		}

		//Backward
		const backwardSquare = board.getNextSquareBackward(file, rank, this.color);
		if (backwardSquare != null && (!board.getPieceOnSquare(backwardSquare.file, backwardSquare.rank) || board.getPieceOnSquare(backwardSquare.file, backwardSquare.rank)?.getColor() != this.color)) {
			possibleMoves.push(backwardSquare);
		}

		//Left
		const leftSquare = board.getNextSquareLeft(file, rank, this.color);
		if (leftSquare != null && (!board.getPieceOnSquare(leftSquare.file, leftSquare.rank) || board.getPieceOnSquare(leftSquare.file, leftSquare.rank)?.getColor() != this.color)) {
			possibleMoves.push(leftSquare);
		}

		//Right
		const rightSquare = board.getNextSquareRight(file, rank, this.color);
		if (rightSquare != null && (!board.getPieceOnSquare(rightSquare.file, rightSquare.rank) || board.getPieceOnSquare(rightSquare.file, rightSquare.rank)?.getColor() != this.color)) {
			possibleMoves.push(rightSquare);
		}

		//Forward Right
		const forwardRightSquare = board.getNextSquareForwardRight(file, rank, this.color);
		if (forwardRightSquare != null && (!board.getPieceOnSquare(forwardRightSquare.file, forwardRightSquare.rank) || board.getPieceOnSquare(forwardRightSquare.file, forwardRightSquare.rank)?.getColor() != this.color)) {
			possibleMoves.push(forwardRightSquare);
		}

		//Forward Left
		const forwardLeftSquare = board.getNextSquareForwardLeft(file, rank, this.color);
		if (forwardLeftSquare != null && (!board.getPieceOnSquare(forwardLeftSquare.file, forwardLeftSquare.rank) || board.getPieceOnSquare(forwardLeftSquare.file, forwardLeftSquare.rank)?.getColor() != this.color)) {
			possibleMoves.push(forwardLeftSquare);
		}

		//Backward Left
		const backwardLeftSquare = board.getNextSquareBackwardLeft(file, rank, this.color);
		if (backwardLeftSquare != null && (!board.getPieceOnSquare(backwardLeftSquare.file, backwardLeftSquare.rank) || board.getPieceOnSquare(backwardLeftSquare.file, backwardLeftSquare.rank)?.getColor() != this.color)) {
			possibleMoves.push(backwardLeftSquare);
		}

		//Backward Right
		const backwardRightSquare = board.getNextSquareBackwardRight(file, rank, this.color);
		if (backwardRightSquare != null && (!board.getPieceOnSquare(backwardRightSquare.file, backwardRightSquare.rank) || board.getPieceOnSquare(backwardRightSquare.file, backwardRightSquare.rank)?.getColor() != this.color)) {
			possibleMoves.push(backwardRightSquare);
		}

		return checkForCausingMate ? possibleMoves.filter( move => !board.isMoveIllegal(file, rank, move.file, move.rank)) : possibleMoves;
	}
}