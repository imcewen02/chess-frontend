import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, HostListener } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Board } from './board';

@Component({
	selector: 'app-game-component',
	imports: [CommonModule],
	templateUrl: './game-component.html',
	styleUrl: './game-component.css'
})
export class GameComponent {
	Board = Board;

  	protected socket: Socket;

	protected gameData: GameData | null = null;
	protected playerColor: string = '';

	protected selectedSquare: string | null = null;
	protected possibleMoves: {file: string, rank: number}[] | undefined = [];

	constructor(private cdr: ChangeDetectorRef) {
		this.socket = io('http://localhost:3000');
		this.socket.on('connect', () => { this.onConnectToServer() });
		this.socket.on('gameUpdate', (data) => { this.onGameUpdate(data) })
		this.socket.on('disconnect', () => { cdr.detectChanges() });
	}

	/***************************
	Server Event Listeners Start
	***************************/
	onConnectToServer() {
		this.socket.emit('joinQueue');
		this.cdr.detectChanges();
	}

	onGameUpdate(data: any) {
		this.playerColor = data.whitePlayer == this.socket.id ? 'white' : 'black';

		this.gameData = {
			uuid: data.uuid,
			whitePlayer: data.whitePlayer,
			blackPlayer: data.blackPlayer,
			board: new Board(this.playerColor, data.board.squares)
		};

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
			this.socket.emit('movePiece', {uuid: this.gameData?.uuid, origin: this.selectedSquare, destination: file + rank});
		}

		const pieceOnSquare = this.gameData?.board.getPieceOnSquare(file, rank);
		this.selectedSquare = pieceOnSquare?.getColor() == this.playerColor ? file + rank : null;
		this.possibleMoves = pieceOnSquare?.getColor() == this.playerColor ? pieceOnSquare?.getPossibleMovesFromSquare(file, rank, this.gameData?.board!, true) : [];

		console.log(this.possibleMoves)
	}

	possibleMovesContainsSquare(file: string, rank: number): boolean {
		return this.possibleMoves?.some(square => square.file === file && square.rank === rank) ?? false;
	}
}

type GameData = {
	uuid: string;
	whitePlayer: string;
	blackPlayer: string;
	board: Board;
}