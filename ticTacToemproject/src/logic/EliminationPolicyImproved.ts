import type { TTTEdges } from '@/utils/Graph'
import type { AIPlayer } from './AIPlayer'
import { EliminationPolicy } from './EliminationPolicy'
import type { GameBoard } from './GameBoard'
import { graphExport } from '@/utils/GraphExport'

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
  modifyWeights(aI: AIPlayer, history: GameBoard[], index: number): TTTEdges {
    const changedEdges: TTTEdges = {}
    const lastMoveSource = history[index - 2].getNormalForm()
    const lastMoveTarget = history[index - 1].getNormalForm()
    const penultimateOptions = aI.getVertexMap(lastMoveSource)
    let preChangeWeight: number = penultimateOptions.get(lastMoveTarget)!

    penultimateOptions.set(lastMoveTarget, 0)

    if (preChangeWeight !== 0) {
      changedEdges[lastMoveSource + '#' + lastMoveTarget] =
        graphExport.value.edges[lastMoveSource + '#' + lastMoveTarget]
    }

    const lastOptions = aI.getVertexMap(lastMoveTarget)
    const winningMove = history[index].getNormalForm()
    if (lastOptions.get(winningMove) !== 0) {
      lastOptions.forEach((_weight, move) => {
        preChangeWeight = lastOptions.get(move)!
        if (move !== winningMove) {
          lastOptions.set(move, 0)
          if (preChangeWeight !== 0) {
            changedEdges[lastMoveTarget + '#' + move] =
              graphExport.value.edges[lastMoveTarget + '#' + move]
          }
        }
      })
    }
    return changedEdges
  }
}
