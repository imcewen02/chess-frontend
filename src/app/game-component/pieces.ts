export abstract class Piece {
	protected color: Color;
	protected imageSource: String;
	
	constructor(color: Color, imageSource: String) {
		this.color = color;
		this.imageSource = imageSource;
	}

	getColor(): Color {
		return this.color;
	}

	getImageSource(): String {
		return this.imageSource;
	}

	abstract getPossibleMoves(origin: string, board: Map<string, Piece | null>) : string[];
}

export class Pawn extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_pawn.png' : 'black_pawn.png');
	}

	override getPossibleMoves(origin: string, board: Map<string, Piece | null>): string[] {
		return [];
	}
}

export class Rook extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_rook.png' : 'black_rook.png');
	}

	override getPossibleMoves(origin: string, board: Map<string, Piece | null>): string[] {
		return [];
	}
}

export class Knight extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_knight.png' : 'black_knight.png');
	}

	override getPossibleMoves(origin: string, board: Map<string, Piece | null>): string[] {
		return [];
	}
}

export class Bishop extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_bishop.png' : 'black_bishop.png');
	}

	override getPossibleMoves(origin: string, board: Map<string, Piece | null>): string[] {
		return [];
	}
}

export class Queen extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_queen.png' : 'black_queen.png');
	}

	override getPossibleMoves(origin: string, board: Map<string, Piece | null>): string[] {
		return [];
	}
}

export class King extends Piece {
	constructor(color: Color) {
		super(color, color == Color.WHITE ? 'white_king.png' : 'black_king.png');
	}

	override getPossibleMoves(origin: string, board: Map<string, Piece | null>): string[] {
		return [];
	}
}

export enum Color {
	WHITE,
	BLACK
}