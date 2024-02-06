import type { AIPlayer } from "./AIPlayer";
import { EliminationPolicy } from "./EliminationPolicy";
import type { GameBoard } from "./GameBoard";

export class EliminationPolicyImproved extends EliminationPolicy {
    modifyWeights(ai: AIPlayer, history: GameBoard[], index: number): void {
        throw new Error("Method not implemented.");
    }
    

}