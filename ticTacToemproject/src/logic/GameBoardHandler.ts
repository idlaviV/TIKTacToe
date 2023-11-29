import type { PlayerNumber } from './PlayerNumber'
import { GameBoard } from './GameBoard'
import { printGameboard } from './GameBoardConsolePrinter'

const gameBoard: GameBoard = new GameBoard([
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
])

export function move(x: number, y: number, player: PlayerNumber) {
  addPiece(x, y, gameBoard, player)
}

function addPiece(x: number, y: number, board: GameBoard, player: PlayerNumber): GameBoard {
  if (board.state[x][y] == 0) {
    const newState: number[][] = board.clone();
    newState[x][y] = player;
    return new GameBoard(newState);
  }
  printGameboard();
  throw new Error('This piece cannot go there')
}

export function getGameBoard(): GameBoard {
  return gameBoard
}

export function resetGameBoard(): void {
  gameBoard.reset()
}
