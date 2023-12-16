import type { FieldType, GameBoard } from '../logic/GameBoard'
import { type Nodes, type Edges } from 'v-network-graph'

export class HistoryExport {
  nodes: Nodes = {}
  edges: Edges = {}
  lastCode: string

  constructor(gameBoard: GameBoard) {
    this.lastCode = gameBoard.getCode().toString()
    this.nodes[this.lastCode] = { name: this.lastCode, boardState: gameBoard.state }
  }

  updateHistory(gameBoard: GameBoard) {
    const newCode: string = gameBoard.getCode().toString()
    this.nodes[newCode] = { name: newCode, boardState: gameBoard.state }
    const key: string = this.lastCode + '#' + newCode
    this.edges[key] = { source: this.lastCode, target: newCode }
    this.lastCode = newCode
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
