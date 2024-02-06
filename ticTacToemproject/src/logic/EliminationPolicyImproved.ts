import type { AIPlayer } from "./AIPlayer";
import { EliminationPolicy } from "./EliminationPolicy";
import type { GameBoard } from "./GameBoard";

export class EliminationPolicyImproved extends EliminationPolicy {
    applyWinningPolicy(aI: AIPlayer, history: GameBoard[]): void {
        throw new Error("Method not implemented.");
    }

}