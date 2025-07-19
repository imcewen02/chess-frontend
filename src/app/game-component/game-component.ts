import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-game-component',
  imports: [CommonModule],
  templateUrl: './game-component.html',
  styleUrl: './game-component.css'
})
export class GameComponent {

  boardData = new Map<string, Piece | null>();
  files: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  ranks: number[] = [8, 7, 6, 5, 4, 3, 2, 1];

  selectedSquare: string = '';

  ngOnInit() {
    this.initializeStartingBoard();
  }

  getPieceBySquare(file: string, rank: number) : Piece | null | undefined {
    return this.boardData.get(file + rank);
  }

  onSquareClicked(file: string, rank: number) {
    this.selectedSquare = file + rank;
  }

  getSquareColorClass(file: string, rank: number) : string {
    if (file + rank == this.selectedSquare && this.boardData.get(file + rank) != null) {
      return 'bg-warning'
    }

    const squareDark = (this.files.indexOf(file) + rank) % 2 != 0;
    if (squareDark) {
      return 'bg-success'
    } else {
      return 'bg-light'
    }
  }

  initializeStartingBoard() {
    //Create entries for every space
    this.files.forEach( file => { this.ranks.forEach( rank => { this.boardData.set(file + rank, null); } ) } );

    //Fill in the starting spaces
    const whitePawn = {type: Type.PAWN, color: Color.WHITE, imageSource: "white_pawn.png"};
    const whiteRook = {type: Type.ROOK, color: Color.WHITE, imageSource: "white_rook.png"};
    const whiteKnight = {type: Type.KNIGHT, color: Color.WHITE, imageSource: "white_knight.png"};
    const whiteBishop = {type: Type.BISHOP, color: Color.WHITE, imageSource: "white_bishop.png"};
    const whiteQueen = {type: Type.QUEEN, color: Color.WHITE, imageSource: "white_queen.png"};
    const whiteKing = {type: Type.KING, color: Color.WHITE, imageSource: "white_king.png"};

    this.boardData.set('A1', whiteRook)
    this.boardData.set('B1', whiteKnight)
    this.boardData.set('C1', whiteBishop)
    this.boardData.set('D1', whiteQueen)
    this.boardData.set('E1', whiteKing)
    this.boardData.set('F1', whiteBishop)
    this.boardData.set('G1', whiteKnight)
    this.boardData.set('H1', whiteRook)

    this.boardData.set('A2', whitePawn)
    this.boardData.set('B2', whitePawn)
    this.boardData.set('C2', whitePawn)
    this.boardData.set('D2', whitePawn)
    this.boardData.set('E2', whitePawn)
    this.boardData.set('F2', whitePawn)
    this.boardData.set('G2', whitePawn)
    this.boardData.set('H2', whitePawn)

    const blackPawn = {type: Type.PAWN, color: Color.BLACK, imageSource: "black_pawn.png"};
    const blackRook = {type: Type.ROOK, color: Color.BLACK, imageSource: "black_rook.png"};
    const blackKnight = {type: Type.KNIGHT, color: Color.BLACK, imageSource: "black_knight.png"};
    const blackBishop = {type: Type.BISHOP, color: Color.BLACK, imageSource: "black_bishop.png"};
    const blackQueen = {type: Type.QUEEN, color: Color.BLACK, imageSource: "black_queen.png"};
    const blackKing = {type: Type.KING, color: Color.BLACK, imageSource: "black_king.png"};

    this.boardData.set('A8', blackRook)
    this.boardData.set('B8', blackKnight)
    this.boardData.set('C8', blackBishop)
    this.boardData.set('D8', blackQueen)
    this.boardData.set('E8', blackKing)
    this.boardData.set('F8', blackBishop)
    this.boardData.set('G8', blackKnight)
    this.boardData.set('H8', blackRook)

    this.boardData.set('A7', blackPawn)
    this.boardData.set('B7', blackPawn)
    this.boardData.set('C7', blackPawn)
    this.boardData.set('D7', blackPawn)
    this.boardData.set('E7', blackPawn)
    this.boardData.set('F7', blackPawn)
    this.boardData.set('G7', blackPawn)
    this.boardData.set('H7', blackPawn)
  }
}

enum Type {
  PAWN,
  ROOK,
  KNIGHT,
  BISHOP,
  QUEEN,
  KING
}

enum Color {
  WHITE,
  BLACK
}

type Piece = {
  type: Type;
  color: Color;
  imageSource: string;
}