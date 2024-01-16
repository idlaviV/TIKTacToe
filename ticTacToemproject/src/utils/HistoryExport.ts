import { ref, type Ref } from 'vue'
import type { FieldType, GameBoard } from '../logic/GameBoard'
import { type Nodes, type Edges } from 'v-network-graph'

export class HistoryExport {
  nodes: Ref<Nodes> = ref({})
  edges: Ref<Edges> = ref({})
  lastCode: string = 'NotInitialized'

  constructor(gameBoard: GameBoard) {
    this.initializeHistory(gameBoard)
  }

  updateHistory(gameBoard: GameBoard) {
    this.nodes.value[this.lastCode].active = false
    const newCode: string = gameBoard.getCode().toString()
    this.nodes.value[newCode] = {
      name: newCode,
      boardState: gameBoard.state,
      active: true,
      isChild: false
    }
    const key: string = this.lastCode + '#' + newCode
    this.edges.value[key] = { source: this.lastCode, target: newCode }
    this.lastCode = newCode
  }

  initializeHistory(gameBoard: GameBoard) {
    this.lastCode = gameBoard.getCode().toString()
    this.nodes.value[this.lastCode] = {
      name: this.lastCode,
      boardState: gameBoard.state,
      active: true
    }
  }

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

  getLastCode(): string {
    return this.lastCode
  }
}

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
