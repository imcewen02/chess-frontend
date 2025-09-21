import { Board } from "../Board";
import { Piece } from "../Piece";

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