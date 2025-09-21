import { Account } from "./Account";
import { Board } from "./Board";

export interface Game {
    uuid: string;
    blackAccount: Account;
    whiteAccount: Account;
    board: Board;
}