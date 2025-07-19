import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-game-component',
  imports: [CommonModule],
  templateUrl: './game-component.html',
  styleUrl: './game-component.css'
})
export class GameComponent {

  boardData = new Map<string, PieceData | null>();

  ngOnInit() {
    this.initializeStartingBoard();
  }

  getPieceByPosition(position: string) : PieceData | null | undefined {
    return this.boardData.get(position);
  }

  positionClicked(position: string) {
    
  }

  initializeStartingBoard() {
    //Create entries for every space
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach( column => { ['1', '2', '3', '4', '5', '6', '7', '8'].forEach( row => { this.boardData.set(column + row, null); } ) } );

    //Fill in the starting spaces
    this.boardData.set('A1', {type: Type.ROOK, color: Color.WHITE, imageSource: "white_rook.png"})
    this.boardData.set('B1', {type: Type.KNIGHT, color: Color.WHITE, imageSource: "white_knight.png"})
    this.boardData.set('C1', {type: Type.BISHOP, color: Color.WHITE, imageSource: "white_bishop.png"})
    this.boardData.set('D1', {type: Type.QUEEN, color: Color.WHITE, imageSource: "white_pawn.png"})
    this.boardData.set('E1', {type: Type.KING, color: Color.WHITE, imageSource: "white_pawn.png"})
    this.boardData.set('F1', {type: Type.BISHOP, color: Color.WHITE, imageSource: "white_bishop.png"})
    this.boardData.set('G1', {type: Type.KNIGHT, color: Color.WHITE, imageSource: "white_knight.png"})
    this.boardData.set('H1', {type: Type.ROOK, color: Color.WHITE, imageSource: "white_rook.png"})

    this.boardData.set('A2', {type: Type.PAWN, color: Color.WHITE, imageSource: "white_pawn.png"})
    this.boardData.set('B2', {type: Type.PAWN, color: Color.WHITE, imageSource: "white_pawn.png"})
    this.boardData.set('C2', {type: Type.PAWN, color: Color.WHITE, imageSource: "white_pawn.png"})
    this.boardData.set('D2', {type: Type.PAWN, color: Color.WHITE, imageSource: "white_pawn.png"})
    this.boardData.set('E2', {type: Type.PAWN, color: Color.WHITE, imageSource: "white_pawn.png"})
    this.boardData.set('F2', {type: Type.PAWN, color: Color.WHITE, imageSource: "white_pawn.png"})
    this.boardData.set('G2', {type: Type.PAWN, color: Color.WHITE, imageSource: "white_pawn.png"})
    this.boardData.set('H2', {type: Type.PAWN, color: Color.WHITE, imageSource: "white_pawn.png"})

    this.boardData.set('A8', {type: Type.ROOK, color: Color.BLACK, imageSource: "black_rook.png"})
    this.boardData.set('B8', {type: Type.KNIGHT, color: Color.BLACK, imageSource: "black_knight.png"})
    this.boardData.set('C8', {type: Type.BISHOP, color: Color.BLACK, imageSource: "black_bishop.png"})
    this.boardData.set('D8', {type: Type.QUEEN, color: Color.BLACK, imageSource: "black_pawn.png"})
    this.boardData.set('E8', {type: Type.KING, color: Color.BLACK, imageSource: "black_pawn.png"})
    this.boardData.set('F8', {type: Type.BISHOP, color: Color.BLACK, imageSource: "black_bishop.png"})
    this.boardData.set('G8', {type: Type.KNIGHT, color: Color.BLACK, imageSource: "black_knight.png"})
    this.boardData.set('H8', {type: Type.ROOK, color: Color.BLACK, imageSource: "black_rook.png"})

    this.boardData.set('A7', {type: Type.PAWN, color: Color.BLACK, imageSource: "black_pawn.png"})
    this.boardData.set('B7', {type: Type.PAWN, color: Color.BLACK, imageSource: "black_pawn.png"})
    this.boardData.set('C7', {type: Type.PAWN, color: Color.BLACK, imageSource: "black_pawn.png"})
    this.boardData.set('D7', {type: Type.PAWN, color: Color.BLACK, imageSource: "black_pawn.png"})
    this.boardData.set('E7', {type: Type.PAWN, color: Color.BLACK, imageSource: "black_pawn.png"})
    this.boardData.set('F7', {type: Type.PAWN, color: Color.BLACK, imageSource: "black_pawn.png"})
    this.boardData.set('G7', {type: Type.PAWN, color: Color.BLACK, imageSource: "black_pawn.png"})
    this.boardData.set('H7', {type: Type.PAWN, color: Color.BLACK, imageSource: "black_pawn.png"})
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

type PieceData = {
  type: Type;
  color: Color;
  imageSource: string;
}
