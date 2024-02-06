import type { AIPlayer } from './AIPlayer'
import type { EvaluationPolicy } from './EvaluationPolicy'
import type { GameBoard } from './GameBoard'
import { GameHandler } from './GameHandler'
import { drawStatus, type WinnerStatus } from './WinnerStatus'

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
  applyWinningPolicy(aI: AIPlayer, history: GameBoard[]): void {
    const handler: GameHandler = GameHandler.getInstance()
    const winner = handler.getWinner().value
    for (let index = history.length - 1; index > 1; index--) {
      if (this.checkIfLooseMove(aI, history, index, winner)) {
        this.modifyWeights(aI, history, index)
      }
    }
  }

  /**
   * Checks whether the move at the given index is a move that leads to a loss,
   * i.e. if the move //TODO
   * @param aI 
   * @param history 
   * @param index 
   * @param winner 
   * @returns 
   */
  checkIfLooseMove(
    aI: AIPlayer,
    history: GameBoard[],
    index: number,
    winner: WinnerStatus
  ): boolean {
    if (winner === drawStatus && index === history.length - 1) {
      return false
    }
    return containsOnlyZeros(aI.getVertexMap(history[index].getNormalForm()))
  }

  abstract modifyWeights(ai: AIPlayer, history: GameBoard[], index: number): void
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
  modifyWeights(aI: AIPlayer, history: GameBoard[], index: number): void {
    const map = aI.getVertexMap(history[index - 2].getNormalForm())
    map.set(history[index - 1].getNormalForm(), 0)
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
