import type { TTTEdges } from '@/utils/Graph'
import type { AIPlayer } from './AIPlayer'
import type { EvaluationPolicy } from './EvaluationPolicy'
import type { GameBoard } from './GameBoard'
import { GameHandler } from './GameHandler'
import { drawStatus, type WinnerStatus } from './WinnerStatus'
import { graphExport } from '@/utils/GraphExport'

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
  applyPolicy(aI: AIPlayer, history: GameBoard[]): TTTEdges {
    const handler: GameHandler = GameHandler.getInstance()
    const winner = handler.getWinner().value
    if (winner !== null) {
      return this.applyWinningPolicy(aI, history)
    }
    return {}
  }

  /**
   * Apply the policy to the AIPlayer.
   */
  private applyWinningPolicy(aI: AIPlayer, history: GameBoard[]): TTTEdges {
    const handler: GameHandler = GameHandler.getInstance()
    const winner = handler.getWinner().value

    let changedWeights: TTTEdges = {}

    for (let index = history.length - 1; index > 1; index--) {
      if (this.checkIfLoosePosition(aI, history, index, winner)) {
        changedWeights = this.modifyWeights(aI, history, index)
      }
    }
    return changedWeights
  }

  /**
   * Checks whether the position at the given index is a loseing position,
   * i.e. if every possible move has weight 0 or the previous move already won the game.
   * @param aI The ai player whose weights should be considered.
   * @param history The history of the played game.
   * @param index The position after index moves is considered.
   * @param winner The winner of the game.
   */
  private checkIfLoosePosition(
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

  /**
   * Modifies the weights of the AIPlayer at the given index.
   * Is only called if the position at the given index is a losing position.
   * @param aI The weights of the AIPlayer to be modified.
   * @param history The history of the played game.
   * @param index The index of the losing position to be considered.
   */
  abstract modifyWeights(ai: AIPlayer, history: GameBoard[], index: number): TTTEdges
}

/**
 * This class implements the {@link EvaluationPolicy} interface.
 * It contains a policy that eliminates the moves that lead to a loss as well as moves that only lead to moves that lead to a loss.
 */
export class EliminationPolicySimple extends EliminationPolicy {
  /**
   * Set the weight of the losing turn to 0.
   * @inheritdoc
   * @override
   */
  modifyWeights(aI: AIPlayer, history: GameBoard[], index: number): TTTEdges {
    const lastMoveSource = history[index - 2].getNormalForm()
    const lastMoveTarget = history[index - 1].getNormalForm()
    const edgeId: string = lastMoveSource + '#' + lastMoveTarget
    const changedWeights: TTTEdges = {}
    changedWeights[edgeId] = graphExport.value.edges[edgeId]

    const map = aI.getVertexMap(lastMoveSource)
    map.set(lastMoveTarget, 0)
    return changedWeights
  }
}

/**
 * Checks whether the given map contains only zeros.
 */
function containsOnlyZeros(map: Map<number, number>): boolean {
  for (const [, weight] of map) {
    if (weight !== 0) {
      return false
    }
  }
  return true
}
