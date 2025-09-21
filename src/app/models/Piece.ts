import { Board } from "./Board";

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