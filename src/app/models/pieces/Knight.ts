import { Board } from "../Board";
import { Piece } from "../Piece";

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