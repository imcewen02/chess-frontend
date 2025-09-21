import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, HostListener } from '@angular/core';
import { ToastService } from '../services/toast-service';
import { SocketService } from '../services/socket-service';
import { Game } from '../models/Game';
import { AccountService } from '../services/account-service';

@Component({
	selector: 'app-game-component',
	imports: [CommonModule],
	templateUrl: './game-component.html',
	styleUrl: './game-component.css'
})
export class GameComponent {
	protected game: Game;
	
	protected Status = Status;
	protected status: Status = Status.SEARCHING;

	protected selectedSquare: string | null = null;
	protected possibleMoves: {file: string, rank: number}[] | undefined = [];

	constructor(
		private toastService: ToastService,
		private socketService: SocketService,
		private accountService: AccountService,
		private cdr: ChangeDetectorRef
	) {
		this.game = new Game();
		this.socketService.emit("games:joinQueue", accountService.getAuthToken());
	}

	/***************************
	Server Event Listeners Start
	***************************/
	onConnectToServer() {
		this.cdr.detectChanges();
	}

	onGameUpdate(data: any) {
		//this.playerColor = data.whitePlayer == this.socket.id ? 'white' : 'black';

		//this.gameData = {
		//	uuid: data.uuid,
		//	whitePlayer: data.whitePlayer,
		//	blackPlayer: data.blackPlayer,
		//	board: new Board(this.playerColor, data.board.squares)
		//};

		this.cdr.detectChanges();
	}

	onDisconnectFromServer() {
		this.cdr.detectChanges();
	}
	/*************************
	Server Event Listeners End
	*************************/

	@HostListener('document:click')
	onClick() {
		this.selectedSquare = null;
		this.possibleMoves = [];
	}

	onSquareClicked(file: string, rank: number) {
		if (this.possibleMovesContainsSquare(file, rank)) {
			//this.socket.emit('movePiece', {uuid: this.gameData?.uuid, origin: this.selectedSquare, destination: file + rank});
		}

		//const pieceOnSquare = this.gameData?.board.getPieceOnSquare(file, rank);
		//this.selectedSquare = pieceOnSquare?.getColor() == this.playerColor ? file + rank : null;
		//this.possibleMoves = pieceOnSquare?.getColor() == this.playerColor ? pieceOnSquare?.getPossibleMovesFromSquare(file, rank, this.gameData?.board!, true) : [];

		console.log(this.possibleMoves)
	}

	possibleMovesContainsSquare(file: string, rank: number): boolean {
		return this.possibleMoves?.some(square => square.file === file && square.rank === rank) ?? false;
	}
}

enum Status {SEARCHING, IN_PROGRESS, COMPLETE};