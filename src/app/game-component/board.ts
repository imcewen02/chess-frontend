import { Piece, Pawn, Rook, Knight, Bishop, Queen, King } from "./pieces";

export class Board {
	private squares: { [square: string]: Piece | null } = {};

	private files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
	private ranks = [8, 7, 6, 5, 4, 3, 2, 1];

	constructor(playerColor: string, boardData: { [square: string]: any }) {
		if (playerColor == 'black') {
			this.files.reverse();
			this.ranks.reverse();
		}

		for (const squareId of Object.keys(boardData)) {
			if (boardData[squareId] == null) {
				this.squares[squareId] = null;
				continue;
			}

			let piece: Piece;
			switch(boardData[squareId].name) {
				case 'pawn': piece = new Pawn(boardData[squareId].color); break;
				case 'rook': piece = new Rook(boardData[squareId].color); break;
				case 'knight': piece = new Knight(boardData[squareId].color); break;
				case 'bishop': piece = new Bishop(boardData[squareId].color); break;
				case 'queen': piece = new Queen(boardData[squareId].color); break;
				case 'king': piece = new King(boardData[squareId].color); break;
			}

			this.squares[squareId] = piece!;
		}
	}

	public getFileAsNumber(file: string): number {
		return this.files.indexOf(file) + 1;
	}

	public getNumberAsFile(file: number): string {
		return this.files[file - 1];
	}

	public getFiles(): string[] {
		return this.files;
	}

	public getRanks(): number[] {
		return this.ranks;
	}

	public getPieceOnSquare(file: string, rank: number) : Piece | null {
		return this.squares[`${file}${rank.toString()}`] ?? null;
	}

	public getNextSquareForward(originFile: string, originRank: number, color: string) : {file: string, rank: number} | null {
		const file = originFile;
		const rank = originRank + (color == 'white' ? 1 : -1);
		return this.squareIdValid(file, rank) ? {file, rank} : null;
	}

	public getNextSquareBackward(originFile: string, originRank: number, color: string) : {file: string, rank: number} | null {
		const file = originFile;
		const rank = originRank + (color == 'white' ? -1 : 1);
		return this.squareIdValid(file, rank) ? {file, rank} : null;
	}

	public getNextSquareLeft(originFile: string, originRank: number, color: string) : {file: string, rank: number} | null {
		const file = this.getNumberAsFile(this.getFileAsNumber(originFile) + (color == 'white' ? -1 : 1));
		const rank = originRank;
		return this.squareIdValid(file, rank) ? {file, rank} : null;
	}

	public getNextSquareRight(originFile: string, originRank: number, color: string) : {file: string, rank: number} | null {
		const file = this.getNumberAsFile(this.getFileAsNumber(originFile) + (color == 'white' ? 1 : -1));
		const rank = originRank;
		return this.squareIdValid(file, rank) ? {file, rank} : null;
	}

	public getNextSquareForwardRight(originFile: string, originRank: number, color: string) : {file: string, rank: number} | null {
		const file = this.getNumberAsFile(this.getFileAsNumber(originFile) + (color == 'white' ? 1 : -1));
		const rank = originRank + (color == 'white' ? 1 : -1);
		return this.squareIdValid(file, rank) ? {file, rank} : null;
	}

	public getNextSquareForwardLeft(originFile: string, originRank: number, color: string) : {file: string, rank: number} | null {
		const file = this.getNumberAsFile(this.getFileAsNumber(originFile) + (color == 'white' ? -1 : 1));
		const rank = originRank + (color == 'white' ? 1 : -1);
		return this.squareIdValid(file, rank) ? {file, rank} : null;
	}

	public getNextSquareBackwardLeft(originFile: string, originRank: number, color: string) : {file: string, rank: number} | null {
		const file = this.getNumberAsFile(this.getFileAsNumber(originFile) + (color == 'white' ? -1 : 1));
		const rank = originRank + (color == 'white' ? -1 : 1);
		return this.squareIdValid(file, rank) ? {file, rank} : null;
	}

	public getNextSquareBackwardRight(originFile: string, originRank: number, color: string) : {file: string, rank: number} | null {
		const file = this.getNumberAsFile(this.getFileAsNumber(originFile) + (color == 'white' ? 1 : -1));
		const rank = originRank + (color == 'white' ? -1 : 1);
		return this.squareIdValid(file, rank) ? {file, rank} : null;
	}

	public squareIdValid(file: string, rank: number): boolean {
		return this.files.includes(file) && this.ranks.includes(rank);
	}

	public isMoveIllegal(originFile: string, originRank: number, destinationFile: string, destinationRank: number) : boolean {
		console.log(originFile, originRank)

		const movingPiece = this.squares[originFile + originRank]!;
		const destinationPiece = this.squares[destinationFile + destinationRank];

		let movingPlayersKingPostion: {file: string, rank: number};
		if (movingPiece.getName() == 'king') {
			movingPlayersKingPostion = {file: destinationFile, rank: destinationRank};
		} else {
			for (const squareId of Object.keys(this.squares)) {
				const pieceAtSquare = this.getPieceOnSquare(squareId[0], Number(squareId[1]));
				if (pieceAtSquare?.getName() == 'king' && pieceAtSquare.getColor() == movingPiece.getColor()) {
					movingPlayersKingPostion = {file: squareId[0], rank: Number(squareId[1])};
					break;
				}
			}
		}

		this.squares[originFile + originRank] = null;
		this.squares[destinationFile + destinationRank] = movingPiece;

		let moveIllegal = false;
		for (const squareId of Object.keys(this.squares)) {
			const pieceAtSquare = this.getPieceOnSquare(squareId[0], Number(squareId[1]));
			if (pieceAtSquare != null && pieceAtSquare?.getColor() != movingPiece?.getColor()) {
				console.log("Moving Piece: " + movingPiece.getColor() + "_" + movingPiece.getName() + " : Checking Piece: " + pieceAtSquare.getColor() + "_" + pieceAtSquare.getName())
				const opposingPiecesPossibleMoves = pieceAtSquare.getPossibleMovesFromSquare(squareId[0], Number(squareId[1]), this, false)
				const opposingPieceCanAttackKing = opposingPiecesPossibleMoves?.some(move => move.file == movingPlayersKingPostion.file && move.rank == movingPlayersKingPostion.rank);
				if (opposingPieceCanAttackKing) {
					moveIllegal = true;
				}
			}
		}

		this.squares[originFile + originRank] = movingPiece;
		this.squares[destinationFile + destinationRank] = destinationPiece;

		return moveIllegal;
	}
}