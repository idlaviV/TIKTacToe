import type { AIPlayer } from './AIPlayer'
import type { EvaluationPolicy } from './EvaluationPolicy'
import type { GameBoard } from './GameBoard'
import { GameHandler } from './GameHandler'
import { drawStatus } from './WinnerStatus'

export abstract class EliminationPolicy implements EvaluationPolicy {
  /**
   * @inheritdoc
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getInitialWeight(height: number): number {
    return 1
  }

  /**
   * Applies the elimination policy to the given AIPlayer.
   * @inheritdoc
   * @override
   */
  applyPolicy(aI: AIPlayer, history: GameBoard[]): void {
    const handler: GameHandler = GameHandler.getInstance()
    const winner = handler.getWinner().value

    if (winner !== null) {
      this.applyWinningPolicy(aI, history)
    }
  }

  /**
   * Apply the policy to the AIPlayer.
   */
  abstract applyWinningPolicy(aI: AIPlayer, history: GameBoard[]): void
}

/**
 * This class implements the {@link EvaluationPolicy} interface.
 * It contains a policy that eliminates the moves that lead to a loss as well as moves that only lead to moves that lead to a loss.
 */
export class EliminationPolicySimple extends EliminationPolicy {
  /**
   * It sets the probability to reach all moves that lead to a loss,
   * as well as moves that only lead to moves that lead to a loss to zero.
   * @inheritdoc
   * @override
   */
  applyWinningPolicy(aI: AIPlayer, history: GameBoard[]): void {
    const handler: GameHandler = GameHandler.getInstance()
    const winner = handler.getWinner().value
    for (let index = history.length - 1; index > 1; index--) {
      let isLossTurn: boolean = containsOnlyZeros(aI.getVertexMap(history[index].getNormalForm()))
      if (winner === drawStatus && index === history.length - 1) {
        isLossTurn = false
      }
      if (isLossTurn) {
        aI.getVertexMap(history[index - 2].getNormalForm()).set(
          history[index - 1].getNormalForm(),
          0
        )
      }
    }
  }
}

function containsOnlyZeros(map: Map<number, number>): boolean {
  for (const [, weight] of map) {
    if (weight !== 0) {
      return false
    }
  }
  return true
}
