import { Board } from "../Board";
import { Piece } from "../Piece";

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