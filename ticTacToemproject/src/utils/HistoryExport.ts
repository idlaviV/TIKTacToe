import { ref, type Ref } from 'vue'
import type { GameBoard } from '../logic/GameBoard'
import { type Nodes, type Edges } from 'v-network-graph'

/**
 * This class represents the progress of a game.
 * It is saved as a graph.
 */
export class HistoryExport {
  nodes: Ref<Nodes> = ref({})
  edges: Ref<Edges> = ref({})
  lastCode: string = 'NotInitialized'

  constructor(gameBoard: GameBoard) {
    this.initializeHistory(gameBoard)
  }

  /**
   * Adds the new game state to the history.
   * @param gameBoard The new game state
   */
  updateHistory(gameBoard: GameBoard) {
    this.nodes.value[this.lastCode].active = false
    const newCode: string = gameBoard.getCode().toString()
    this.nodes.value[newCode] = { name: newCode, boardState: gameBoard.state, active: true }
    const key: string = this.lastCode + '#' + newCode
    this.edges.value[key] = { source: this.lastCode, target: newCode }
    this.lastCode = newCode
  }

  /**
   * Initializes the history.
   * The passed gameboard is set as the first game state.
   * @param gameBoard The first state of the history.
   */
  initializeHistory(gameBoard: GameBoard) {
    this.lastCode = gameBoard.getCode().toString()
    this.nodes.value[this.lastCode] = {
      name: this.lastCode,
      boardState: gameBoard.state,
      active: true
    }
  }

  /**
   * Resets the history.
   * The passed gameboard is set as the first game state of the new history.
   * @param gameBoard The first game state of the new history
   */
  resetHistory(gameBoard: GameBoard) {
    Object.keys(this.nodes.value).forEach((element) => {
      delete this.nodes.value[element]
    })
    Object.keys(this.edges.value).forEach((element) => {
      delete this.edges.value[element]
    })
    this.initializeHistory(gameBoard)
  }

  getNodes(): Ref<Nodes> {
    return this.nodes
  }

  getEdges(): Ref<Edges> {
    return this.edges
  }
}
