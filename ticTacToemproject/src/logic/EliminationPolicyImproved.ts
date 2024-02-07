import type { AIPlayer } from './AIPlayer'
import { EliminationPolicy } from './EliminationPolicy'
import type { GameBoard } from './GameBoard'

/**
 * This policy is an improved version of the simple elimination policy.
 * It sets the weights of losing turns and alternatives to winning turns to 0.
 */
export class EliminationPolicyImproved extends EliminationPolicy {
  /**
   * Set the weights of the losing turn to 0.
   * Set the weights of alternatives to the previous winning turn to 0.
   * @inheritdoc
   * @override
   */
  modifyWeights(aI: AIPlayer, history: GameBoard[], index: number): void {
    const penultimateOptions = aI.getVertexMap(history[index - 2].getNormalForm())
    penultimateOptions.set(history[index - 1].getNormalForm(), 0)

    const lastOptions = aI.getVertexMap(history[index - 1].getNormalForm())
    const winningMove = history[index].getNormalForm()
    if (lastOptions.get(winningMove) !== 0) {
      lastOptions.forEach((_weight, move) => {
        if (move !== winningMove) {
          lastOptions.set(move, 0)
        }
      })
    }
  }
}
