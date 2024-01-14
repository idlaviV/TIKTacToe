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

  applyWinningPolicy(aI: AIPlayer, history: GameBoard[]): void {
    const lastAiTurnStart = history[history.length - 3].getNormalForm()
    const lastAiTurnEnd = history[history.length - 2].getNormalForm()

    aI.weights.get(lastAiTurnStart)?.set(lastAiTurnEnd, 0)

    for (let index = history.length - 3; index > 1; index -= 2) {
      const board = history[index].getNormalForm()
      for (const value of aI.weights.get(board)?.values() ?? []) {
        if (value !== 0) {
          return
        }
      }
      aI.weights.get(history[index - 2].getNormalForm())?.set(history[index - 1].getNormalForm(), 0)
    }
  }
}
