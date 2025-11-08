import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Account } from "../models/account";
import { Color, Piece } from "../models/pieces";

@Component({
	selector: 'player-bar-component',
	imports: [CommonModule],
	templateUrl: './player-bar-component.html',
	styleUrl: './player-bar-component.css'
})
export class PlayerBarComponent {
	protected COLOR_OPTIONS = Color;

    @Input() account: Account | null = null;
	@Input() color: Color = Color.White;
	@Input() timeRemainingMs: number = 0;
	@Input() capturedPieces: Piece[] = [];

	constructor() {

	}

    /**
     * Turns a millisecond value into a string value for display
	 * @param ms - the ms to transform into a string value
     * @returns the display value (stopping at 0)
     */
	protected getTimeRemainingLabel(ms: number): string {
		const minutes = ms < 0 ? 0 : Math.floor(ms / 60000);
		const seconds = ms < 0 ? 0 : Math.floor((ms % 60000) / 1000);
		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	}
}