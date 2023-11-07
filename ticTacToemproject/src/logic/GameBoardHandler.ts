import type { PlayerNumber } from './PlayerNumber'
import { GameBoard } from './GameBoard'

let gameBoard: GameBoard = new GameBoard([
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
])

function move(x: number, y: number, player: PlayerNumber): void {
  gameBoard = addPiece(x, y, gameBoard, player)
}

function addPiece(x: number, y: number, board: GameBoard, player: PlayerNumber): GameBoard {
  if (board.state[x][y] == 0) {
    const newState: number[][] = board.state
    newState[x][y] == player
    return new GameBoard(newState)
  }
  throw new Error('This piece cannot go there')
}
