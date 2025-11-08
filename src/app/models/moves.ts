import { Name } from "./pieces";
import { Position } from "./position";

export interface Move {
    origin: Position;
    destination: Position;
    promoteTo: Name | null;
}