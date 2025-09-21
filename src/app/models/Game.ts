import { Board } from "./Board";

export class Game {
    private state: State;
    private board: Board;

    constructor() {
        this.state = State.SEARCHING;
        this.board = new Board("white", {});
    }

    public getState(): State {
        return this.state;
    }

    public getBoard(): Board {
        return this.board;
    }
}

export enum State {SEARCHING, IN_PROGRESS, COMPLETE};