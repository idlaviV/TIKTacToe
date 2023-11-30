import { move } from "./GameBoardHandler";
import type { PlayerNumber } from "./PlayerNumber";

export function moveHandler(x : string, y: string, player: PlayerNumber) {
    move(parseInt(x), parseInt(y), player)
}