import { ref, type Ref } from 'vue'
import type { GameBoard } from '../logic/GameBoard'
import { type Nodes, type Edges } from 'v-network-graph'
import type { FieldType } from '@/logic/FieldType'
import { HistoryWithChildrenExport } from './HistoryWithChildrenExport'

/**
 * This class represents the progress of a game.
 * It is saved as a graph.
 */
export class HistoryExport {
  nodes: Ref<Nodes> = ref({})
  edges: Ref<Edges> = ref({})
  historyWithChildrenExport: HistoryWithChildrenExport
  lastCode: string = 'NotInitialized'

  constructor(gameBoard: GameBoard) {
    this.initializeHistory(gameBoard)
    this.historyWithChildrenExport = new HistoryWithChildrenExport(
      this.nodes.value,
      this.edges.value,
      this.lastCode
    )
  }

  /**
   * Adds the new game state to the history. Updates the historyWithChildren.
   * @param gameBoard The new game state
   */
  updateHistory(gameBoard: GameBoard) {
    this.nodes.value[this.lastCode].active = false
    const newCode: string = gameBoard.getCode().toString()
    this.nodes.value[newCode] = {
      name: newCode,
      boardState: gameBoard.state,
      active: true
    }
    const key: string = this.lastCode + '#' + newCode
    this.edges.value[key] = { source: this.lastCode, target: newCode }
    this.lastCode = newCode
    this.historyWithChildrenExport.update(this.nodes.value, this.edges.value, this.lastCode)
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
    this.historyWithChildrenExport.update(this.nodes.value, this.edges.value, this.lastCode)
  }

  getHistoryWithChildrenExport() {
    return this.historyWithChildrenExport
  }

  getNodes(): Ref<Nodes> {
    return this.nodes
  }

  getEdges(): Ref<Edges> {
    return this.edges
  }
}

/**
 * Converts the state of a field into the string representation.
 *    1 -> player1
 *    2 -> player2
 *    3 -> empty field
 * @param fieldType the state of the field
 * @returns The string to be displayed.
 */
export function convertFieldType(fieldType: FieldType): string {
  if (fieldType == 1) {
    return 'X'
  } else if (fieldType == 2) {
    return 'O'
  } else if (fieldType == 0) {
    return ' '
  }
  throw new Error('Unexpected player in field found.')
}
