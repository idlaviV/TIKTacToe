import type { AIPlayer } from './AIPlayer'
import type { EvaluationPolicy } from './EvaluationPolicy'
import type { GameBoard } from './GameBoard'
import { GameHandler } from './GameHandler'
import { drawStatus } from './WinnerStatus'

/**
 * This class implements the {@link EvaluationPolicy} interface.
 * It contains a policy that eliminates the moves that lead to a loss as well as moves that only lead to moves that lead to a loss.
 */
export class EliminationPolicy implements EvaluationPolicy {
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
   * It sets the probability to reach all moves that lead to a loss,
   * as well as moves that only lead to moves that lead to a loss to zero.
   * @inheritdoc
   * @override
   */
  applyPolicy(aI: AIPlayer, history: GameBoard[]): void {
    const handler: GameHandler = GameHandler.getInstance()
    const winner = handler.getWinner().value

    if (winner !== null || winner !== drawStatus) {
      this.applyWinningPolicy(aI, history)
    }
  }

  private applyWinningPolicy(aI: AIPlayer, history: GameBoard[]): void {
    for (let index = history.length - 1; index > 1; index--) {
      if (containsOnlyZeros(aI.getVertexMap(history[index].getNormalForm()))) {
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
