import { ref, type Ref } from 'vue'
import { GameBoard } from '../logic/GameBoard'
import { type Nodes, type Edges } from 'v-network-graph'
import { GameHandler } from '@/logic/GameHandler'
import { IsomorphismGroup } from '@/logic/IsomorphismGroup'

/**
 * This class represents the graph which is shown in the game view on the right side.
 * It contains the history with the representatives of the equivalence classes of the possible next game states.
 * It is created by the historyExport. So don't create it elsewhere.
 */
export class HistoryWithChildrenExport {
  nodes: Ref<Nodes> = ref({})
  edges: Ref<Edges> = ref({})
  lastCode: string = 'NotInitialized'

  constructor(nodes: Nodes, edges: Edges, lastCode: string) {
    this.overwrite(nodes, edges, lastCode)
  }

  /**
   * Whenever the history is changed, the HistoryWithChildren is rebuilt.
   * To do this, it is overwritten with the history and the children are then added.
   * Only call this function within the HistoryExport class in an active game, because it depends on the GameHandler status.
   * @param nodes the nodes of the history
   * @param edges the edges of the history
   * @param lastCode the last GameState of the history in its code form
   */
  update(nodes: Nodes, edges: Edges, lastCode: string) {
    this.deleteNodesAndEdges()
    this.overwrite(nodes, edges, lastCode)
    this.addChildren()
  }

  /**
   * Resets the nodes and edges.
   */
  deleteNodesAndEdges() {
    Object.keys(this.nodes.value).forEach((element) => {
      delete this.nodes.value[element]
    })
    Object.keys(this.edges.value).forEach((element) => {
      delete this.edges.value[element]
    })
  }

  /**
   * Overwrites the historyWithChildren with the history.
   * @param nodes the nodes of the history
   * @param edges the edges of the history
   * @param lastCode the last GameState of the history in its code form
   */
  overwrite(nodes: Nodes, edges: Edges, lastCode: string) {
    Object.keys(nodes).forEach((element) => {
      this.nodes.value[element] = nodes[element]
    })
    Object.keys(edges).forEach((element) => {
      this.edges.value[element] = edges[element]
    })

    this.lastCode = lastCode
  }

  /**
   * Adds the representatives of the equivalence classes of the possible next game states to the graph.
   */
  addChildren() {
    // From the possible next moves the representatives of the equivalence classes are selected.
    const childrenOfActiveGameBoard:GameBoard[] = GameHandler.getInstance().getPossibleNextPositions()
    const representativesOfChildren:number[] =
      IsomorphismGroup.getRepresentativesOfNonequivalentGameBoards(childrenOfActiveGameBoard)
    const representativeOfChildrenAsGameBoards: GameBoard[] = []
    childrenOfActiveGameBoard.forEach((element) => {
      if (representativesOfChildren.includes(element.getCode())) {
        representativeOfChildrenAsGameBoards.push(element)
      }
    })

    // The representatives of the equivalence classes are added to the graph.
    for (const representativeAsGameboard of representativeOfChildrenAsGameBoards) {
      const newCode: string = representativeAsGameboard.getCode().toString()
      this.nodes.value[newCode] = {
        name: newCode,
        boardState: representativeAsGameboard.state,
        active: false,
        isChild: true
      }
      const edgeKey: string = this.lastCode + '#' + newCode
      this.edges.value[edgeKey] = { source: this.lastCode, target: newCode }
    }
  }

  getNodes(): Ref<Nodes> {
    return this.nodes
  }

  getEdges(): Ref<Edges> {
    return this.edges
  }
}
