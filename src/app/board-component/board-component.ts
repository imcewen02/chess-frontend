import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostListener, Input, OnChanges, Output } from "@angular/core";
import { Color, Name, Piece } from "../models/pieces";
import { Position } from "../models/position";
import { GAME_OVER_STATES, State } from "../models/game";
import { Board } from "../models/board";
import { Move } from "../models/moves";

@Component({
	selector: 'board-component',
	imports: [CommonModule],
	templateUrl: './board-component.html',
	styleUrl: './board-component.css'
})
export class BoardComponent implements OnChanges {
	protected PIECE_NAMES = Name;
    protected GAME_STATES = State;
    protected GAME_OVER_STATES = GAME_OVER_STATES;
	protected PROMOTION_OPTIONS = [Name.Rook, Name.Knight, Name.Bishop, Name.Queen];

	@Input() board: Board = new Board(null);
	@Input() usersColor: Color = Color.White;
	@Input() isUsersTurn: boolean = false;

	@Output() moveEvent = new EventEmitter<Move>();

	protected ranks = this.usersColor == Color.White ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
	protected files = this.usersColor == Color.White ? ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] : ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];

	protected awaitingPawnPromotion: boolean = false;
	protected lastClickedPosition: Position | null = null;
	protected selectedPiece: Piece | null = null;

	@HostListener('click') onClick() { this.lastClickedPosition = null; this.selectedPiece = null; }

	constructor() {

	}

	ngOnChanges(): void {
		this.ranks = this.usersColor == Color.White ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
		this.files = this.usersColor == Color.White ? ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] : ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
	}

    /**
     * Handles board interaction (checking for available moves, moving pieces, etc.)
	 * Interaction is only available during the users turn
     * 
     * @param clickedPosition the position that was clicked
     */
	protected onPositionClicked(clickedPosition: Position): void {
		this.lastClickedPosition = clickedPosition;

		if (!this.isUsersTurn) {
			this.selectedPiece == null;
			return;
		};

		if (this.isPositionInSelectedPiecesLegalMoves(this.lastClickedPosition)) {
			//Move the selected piece
			if (this.selectedPiece?.name == Name.Pawn && this.lastClickedPosition.rank == (this.selectedPiece?.color == Color.White ? 8 : 1)) {
				this.awaitingPawnPromotion = true;
				return;
			}
			
			this.moveEvent.emit({origin: this.board.getPositionOfPiece(this.selectedPiece!)!, destination: this.lastClickedPosition, promoteTo: null})
			this.selectedPiece = null;
		} else {
			//Select your own piece
			const pieceAtClickedPosition = this.board.getPieceAtPosition(this.lastClickedPosition);
			if (pieceAtClickedPosition?.color == this.usersColor) this.selectedPiece = pieceAtClickedPosition;
		}
	}

    /**
     * Handles the confirmation of a pawn promotion, sending a special move instruction
     * 
     * @param promoteTo the name of the piece to promote to
     */
	protected onPawnPromotionConfirmed(promoteTo: Name): void {
		this.moveEvent.emit({origin: this.board.getPositionOfPiece(this.selectedPiece!)!, destination: this.lastClickedPosition!, promoteTo: promoteTo})
		this.selectedPiece = null;
		this.awaitingPawnPromotion = false;
	}

    /**
     * Checks if the provided position is one of the moves of the piece at the selected position
	 * 
	 * @param position the position to check for
     * 
     * @returns if the provided position is one of the moves of the piece at the selected position
     */
	protected isPositionInSelectedPiecesLegalMoves(position: Position): boolean {
		return this.selectedPiece?.getAvailableMoves(this.board, true)?.some(move => move.rank == position.rank && move.file == position.file) ?? false;
	}

	/**
     * Turns a state value into a string value for display
	 * 
	 * @param state: the state to get the label for
     * 
     * @returns the display value
     */
	protected getModalLabelFromEndState(state: State): string {
		switch(state) {
			case State.WhitePlayerWinByMate: return "White Player Wins By Mate";
			case State.WhitePlayerWinByTime: return "White Player Wins On Time";
			case State.WhitePlayerWinByResignation: return "White Player Wins By Resignation";
			case State.BlackPlayerWinByMate: return "Black Player Wins By Mate";
			case State.BlackPlayerWinByTime: return "Black Player Wins On Time";
			case State.BlackPlayerWinByResignation: return "Black Player Wins By Resignation";
			case State.Stalemate: return "Game Ends In Stalemate";
			case State.Draw: return "Game Ends In Draw";
			default: return "An Error Ocurred!";
		}
	}
}