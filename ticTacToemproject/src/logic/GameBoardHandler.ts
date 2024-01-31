import type { PlayerNumber } from './PlayerNumber'
import { GameBoard, getGameBoardFromCode, getPlayerOnTurn } from './GameBoard'
import type { FieldType } from './FieldType'
import { drawStatus, type WinnerStatus } from './WinnerStatus'
import type { GameBoardWithPrevMove } from './Moves'
import { ref, type Ref } from 'vue'
import { CustomError } from 'ts-custom-error'
import type { NormalForm } from './Codes'
import { GameHandler } from './GameHandler'

/**
 * This class handles the gameboard. It keeps track of the current gameboard and the history of the gameboard.
 * It also provides methods to add pieces to the gameboard and to calculate the winner.
 */
export class GameBoardHandler {
  gameBoard: Ref<GameBoard> = ref(new GameBoard())
  history: GameBoard[] = [this.gameBoard.value]

  /**
   * Adds a piece to the gameboard and updates the history.
   * @param x the x coordinate of the piece to be added
   * @param y the y coordinate of the piece to be added
   * @param player the player that made the move
   */
  move(x: number, y: number, player: PlayerNumber) {
    this.gameBoard.value = this.addPiece(x, y, this.gameBoard.value, player)
    this.history.push(this.gameBoard.value)
  }

  /**
   * Adds a piece to a gameboard.
   * @param x the x coordinate of the piece to be added
   * @param y the y coordinate of the piece to be added
   * @param board the board to add the piece to
   * @param player the player that made the move
   * @returns the updated gameboard
   */
  // private
  addPiece(x: number, y: number, board: GameBoard, player: PlayerNumber): GameBoard {
    if (0 <= x && x <= 2 && 0 <= y && y <= 2 && board.state[x][y] == 0) {
      const newState: FieldType[][] = board.clone()
      newState[x][y] = player
      return new GameBoard(newState)
    }
    throw new MoveError(x, y, player)
  }

  /**
   * Resets the gameboard to an empty gameboard and resets the history.
   */
  resetGameBoard(): void {
    this.gameBoard.value = new GameBoard()
    this.history = [this.gameBoard.value]
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
    const squares = this.gameBoard.value.state.flat()
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

  /**
   * Calculates all possible next positions from a given gameboard.
   * It does this by trying to add a piece to each empty cell.
   * It does not account for gameboards possibly being equivalent.
   * @param currentPlayer The player that is currently on turn.
   * @param gameBoard A gameboard to calculate the possible next positions from. If not provided, the current gameboard is used.
   * @returns An array of possible next positions, each containing a gameboard and the move that was made to get to it.
   */
  getPossibleNextPositions(
    currentPlayer: PlayerNumber,
    gameBoard: GameBoard = this.gameBoard.value
  ): GameBoardWithPrevMove[] {
    const possibleNextPositions: GameBoardWithPrevMove[] = []
    if (this.calculateWinner() === null) {
      for (let i = 0; i < gameBoard.state.length; i++) {
        for (let j = 0; j < gameBoard.state[i].length; j++) {
          if (gameBoard.state[i][j] === 0) {
            const newBoard: GameBoard = this.addPiece(i, j, gameBoard, currentPlayer)
            possibleNextPositions.push([newBoard, [i, j]])
          }
        }
      }
    }
    return possibleNextPositions
  }

  getGameBoard(): GameBoard {
    return this.gameBoard.value
  }

  getGameBoardExport() {
    return this.gameBoard
  }
}

/**
 * Calculate the normal forms of the positions following the current gameboard.
 * @returns a set containing all normal forms
 */
export function calculateNextNFs(code: NormalForm): Set<number> {
  const handler = GameHandler.getInstance()
  const nextNFs: Set<number> = new Set()
  const nextPositions = handler
    .getGBHandler()
    .getPossibleNextPositions(getPlayerOnTurn(code), getGameBoardFromCode(code))
  for (const board of nextPositions) {
    nextNFs.add(board[0].getNormalForm())
  }
  return nextNFs
}

export class MoveError extends CustomError {
  public constructor(x: number, y: number, player: PlayerNumber) {
    super('Player ' + player + ' cannot move to (' + x + ',' + y + ')')
  }
}
