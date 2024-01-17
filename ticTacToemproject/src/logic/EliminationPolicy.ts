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

    if (winner === null || winner === drawStatus) {
      return
    } else {
      this.applyWinningPolicy(aI, history)
    }
  }

  //private
  applyWinningPolicy(aI: AIPlayer, history: GameBoard[]): void {
    const lastLooserTurnStart = history[history.length - 3].getNormalForm()
    const lastLooserTurnEnd = history[history.length - 2].getNormalForm()

    aI.getVertexMap(lastLooserTurnStart).set(lastLooserTurnEnd, 0)

    for (let index = history.length - 3; index > 1; index-=2) {
      for (const [_, weight] of aI.getVertexMap(history[index].getNormalForm())) {
        if (weight !== 0) {
          return
        }
      }
      aI.getVertexMap(history[index - 2].getNormalForm()).set(history[index - 1].getNormalForm(), 0)
    }
  }
}
