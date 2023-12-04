import type { PlayerNumber } from './PlayerNumber'
import { GameBoard } from './GameBoard'
import { printGameboard } from './GameBoardConsolePrinter'

let gameBoard: GameBoard = new GameBoard([
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
])

export function move(x: number, y: number, player: PlayerNumber) {
  gameBoard = addPiece(x, y, gameBoard, player)
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
  gameBoard.setState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ])
  gameBoard.setCode(0)
}

export function calculateWinner(squares: number[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] !== 0 && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
