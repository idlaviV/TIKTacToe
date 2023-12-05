import type { PlayerNumber } from './PlayerNumber'
import { GameBoard } from './GameBoard'
import { printGameboard } from './GameBoardConsolePrinter'

export class GameBoardHandler {
  gameBoard: GameBoard = new GameBoard([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ])

  history: GameBoard[] = [this.gameBoard]

  winner: number | null = null

  getWinner() {
    return this.winner
  }

  move(x: number, y: number, player: PlayerNumber) {
    this.gameBoard = this.addPiece(x, y, this.gameBoard, player)
    this.history.push(this.gameBoard)
    this.winner = this.calculateWinner()
  }

  addPiece(x: number, y: number, board: GameBoard, player: PlayerNumber): GameBoard {
    if (board.state[x][y] == 0) {
      const newState: number[][] = board.clone()
      newState[x][y] = player
      return new GameBoard(newState)
    }
    printGameboard(this.gameBoard)
    throw new Error('This piece cannot go there')
  }

  getGameBoard(): GameBoard {
    return this.gameBoard
  }

  resetGameBoard(): void {
    this.gameBoard.state = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
    this.gameBoard.code = 0
    this.winner = null
    this.history = [this.gameBoard]
  }

  calculateWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]
    const squares = this.gameBoard.state.flat()
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] !== 0 && squares[a] === squares[b] && squares[a] === squares[c]) {
        console.log('gbh noticed winner %d', squares[a])
        return squares[a]
      }
    }
    return null
  }
}
