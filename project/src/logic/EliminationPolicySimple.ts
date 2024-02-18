import type { TTTEdges } from '@/utils/Graph'
import { graphExport } from '@/utils/GraphExport'
import type { AIPlayer } from './AIPlayer'
import { EliminationPolicy } from './EliminationPolicy'
import type { GameBoard } from './GameBoard'

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

    const map = aI.getVertexMap(lastMoveSource)
    const preChangeWeight = map.get(lastMoveTarget)!
    map.set(lastMoveTarget, 0)
    if (preChangeWeight !== 0) {
      changedWeights[edgeId] = graphExport.value.edges[edgeId]
    }
    return changedWeights
  }

  getName(): string {
    return 'Elimination'
  }
}
