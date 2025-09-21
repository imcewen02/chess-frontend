import { Board } from "../Board";
import { Piece } from "../Piece";

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