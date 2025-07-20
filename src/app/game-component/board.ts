import { Piece, Pawn, Rook, Knight, Bishop, Queen, King, Color } from './pieces';

export class Board {
	private static files: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
	private static ranks: number[] = [8, 7, 6, 5, 4, 3, 2, 1];
	private pieces: Map<string, Piece> = new Map<string, Piece>();

	constructor() {
		//Create entries for every space
		//Board.files.forEach( file => { Board.ranks.forEach( rank => { this.pieces.set(file + rank, null); } ) } );

		//Fill in the starting spaces
		this.pieces.set('A1', new Rook(Color.WHITE))
		this.pieces.set('B1', new Knight(Color.WHITE))
		this.pieces.set('C1', new Bishop(Color.WHITE))
		this.pieces.set('D1', new Queen(Color.WHITE))
		this.pieces.set('E1', new King(Color.WHITE))
		this.pieces.set('F1', new Bishop(Color.WHITE))
		this.pieces.set('G1', new Knight(Color.WHITE))
		this.pieces.set('H1', new Rook(Color.WHITE))

		this.pieces.set('A2', new Pawn(Color.WHITE))
		this.pieces.set('B2', new Pawn(Color.WHITE))
		this.pieces.set('C2', new Pawn(Color.WHITE))
		this.pieces.set('D2', new Pawn(Color.WHITE))
		this.pieces.set('E2', new Pawn(Color.WHITE))
		this.pieces.set('F2', new Pawn(Color.WHITE))
		this.pieces.set('G2', new Pawn(Color.WHITE))
		this.pieces.set('H2', new Pawn(Color.WHITE))

		this.pieces.set('A8', new Rook(Color.BLACK))
		this.pieces.set('B8', new Knight(Color.BLACK))
		this.pieces.set('C8', new Bishop(Color.BLACK))
		this.pieces.set('D8', new Queen(Color.BLACK))
		this.pieces.set('E8', new King(Color.BLACK))
		this.pieces.set('F8', new Bishop(Color.BLACK))
		this.pieces.set('G8', new Knight(Color.BLACK))
		this.pieces.set('H8', new Rook(Color.BLACK))

		this.pieces.set('A7', new Pawn(Color.BLACK))
		this.pieces.set('B7', new Pawn(Color.BLACK))
		this.pieces.set('C7', new Pawn(Color.BLACK))
		this.pieces.set('D7', new Pawn(Color.BLACK))
		this.pieces.set('E7', new Pawn(Color.BLACK))
		this.pieces.set('F7', new Pawn(Color.BLACK))
		this.pieces.set('G7', new Pawn(Color.BLACK))
		this.pieces.set('H7', new Pawn(Color.BLACK))
	}

	getFiles() : string[] {
		return Board.files;
	}

	getFileAsNumber(file: string) : number {
		return Board.files.indexOf(file) + 1;
	}

	getNumberAsFile(fileIndex: number) : string {
		return fileIndex > 8 || fileIndex < 1 ? '' : Board.files[fileIndex - 1];
	}

	getRanks() : number[] {
		return Board.ranks;
	}

	getPieceOnSquare(square: Square) : Piece | null | undefined {
		return this.pieces.get(square.toStringId());
	}

	movePiece(origin: Square, destination: Square) {
		this.pieces.set(destination.toStringId(), this.pieces.get(origin.toStringId())!)
		this.pieces.delete(origin.toStringId());
	}
}

export class Square {
	private file: string;
	private rank: number;

	constructor(file: string, rank: number) {
		this.file = file;
		this.rank = rank;
	}

	getFile() : string {
		return this.file;
	}

	getRank() : number {
		return this.rank;
	}

	toStringId() : string {
		return this.file + this.rank;
	}
}