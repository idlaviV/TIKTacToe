import type { PlayerNumber } from './PlayerNumber'
import { GameBoard } from './GameBoard'
import type { FieldType } from './GameBoard'
import { printGameboard } from './GameBoardConsolePrinter'
import { drawStatus, type WinnerStatus } from './WinnerStatus'

export class GameBoardHandler {
  gameBoard: GameBoard = new GameBoard()

  history: GameBoard[] = [this.gameBoard]

  move(x: number, y: number, player: PlayerNumber) {
    this.gameBoard = this.addPiece(x, y, this.gameBoard, player)
    this.history.push(this.gameBoard)
  }

  addPiece(x: number, y: number, board: GameBoard, player: PlayerNumber): GameBoard {
    if (board.state[x][y] == 0) {
      const newState: FieldType[][] = board.clone()
      newState[x][y] = player
      return new GameBoard(newState)
    }
    printGameboard(this.gameBoard)
    throw new Error('This piece cannot go there')
  }

  resetGameBoard(): void {
    this.gameBoard = new GameBoard()
    this.history = [this.gameBoard]
  }

  calculateWinner(): WinnerStatus {
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
        return squares[a] === 1 ? 1 : 2
      }
    }
    for (const cell in squares) {
      if (squares[cell] == 0) {
        return null
      }
    }
    return drawStatus
  }

  getPossibleNextPositions(
    currentPlayer: PlayerNumber,
    gameBoard: GameBoard = this.gameBoard
  ): GameBoard[] {
    const possibleNextPositions: GameBoard[] = []
    if (this.calculateWinner() === null) {
      for (let i = 0; i < gameBoard.state.length; i++) {
        for (let j = 0; j < gameBoard.state[i].length; j++) {
          if (gameBoard.state[i][j] === 0) {
            const newBoard: FieldType[][] = gameBoard.clone() // Warum nicht addPiece benutzen?
            newBoard[i][j] = currentPlayer === 1 ? 1 : 2 // Warum wird hier nicht direkt currentPlayer reingepackt?
            possibleNextPositions.push(new GameBoard(newBoard))
          }
        }
      }
    }
    return possibleNextPositions
  }

  getGameBoard(): GameBoard {
    return this.gameBoard
  }
}
