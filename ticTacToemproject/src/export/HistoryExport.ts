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

  convertBoard(board: FieldType[][]): string[][] {
    const newBoard: string[][] = []
    for (let i = 0; i < board.length; i++) {
      newBoard.push([])
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] == 1) {
          newBoard[i].push('X')
        } else if (board[i][j] == 2) {
          newBoard[i].push('O')
        } else if (board[i][j] == 0) {
          newBoard[i].push('')
        }
      }
    }
    return newBoard
  }
}
