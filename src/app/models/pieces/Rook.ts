import { Board } from "../Board";
import { Piece } from "../Piece";

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