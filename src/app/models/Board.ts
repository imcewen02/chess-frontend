import { Piece } from "./piece";

export interface Board {
	squares: (Piece | null) [][];
}