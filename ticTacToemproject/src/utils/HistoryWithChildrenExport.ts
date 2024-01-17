import { ref, type Ref } from 'vue'
import { GameBoard } from '../logic/GameBoard'
import { type Nodes, type Edges } from 'v-network-graph'
import { GameHandler } from '@/logic/GameHandler'
import { IsomorphismGroup } from '@/logic/IsomorphismGroup'

/**
 * This class represents the graph which is shown in the game view on the right side.
 * It contains the history with the representatives of the equivalence classes of the possible next game states.
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
    const childrenOfActiveGameBoard = GameHandler.getInstance().getPossibleNextPositions()
    const representativesOfNonequivalentGameBoards =
      IsomorphismGroup.getRepresentativesOfNonequivalentGameBoards(childrenOfActiveGameBoard)
    const representativeGameBoards: GameBoard[] = []
    childrenOfActiveGameBoard.forEach((element) => {
      if (representativesOfNonequivalentGameBoards.includes(element.getCode())) {
        representativeGameBoards.push(element)
      }
    })
    
    // The representatives of the equivalence classes are added to the graph.
    for (let index = 0; index < representativeGameBoards.length; index++) {
      let newCode: string = representativeGameBoards[index].getCode().toString()
      this.nodes.value[newCode] = {
        name: newCode,
        boardState: representativeGameBoards[index].state,
        active: false,
        isChild: true
      }
      const key: string = this.lastCode + '#' + newCode
      this.edges.value[key] = { source: this.lastCode, target: newCode }
    }
  }

  getNodes(): Ref<Nodes> {
    return this.nodes
  }

  getEdges(): Ref<Edges> {
    return this.edges
  }
}
