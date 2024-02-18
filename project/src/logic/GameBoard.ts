import type { GameBoardCode, NormalForm } from './Codes'
import { symbol, type FieldType } from './FieldType'
import { IsomorphismGroup } from './IsomorphismGroup'
import type { PlayerNumber } from './PlayerNumber'

/**
 * This class represents a gameboard. Both the gameboard that can be played on as well as gameboards used in other classes.
 */
export class GameBoard {
  state: FieldType[][]
  code: GameBoardCode = -1
  normalForm: NormalForm = -1

  /**
   * Creates a new gameboard. It defaults to an empty gameboard, where all fields are 0.
   *
   * @param state The state of the gameboard. The first index represents the row, the second index represents the column.
   * The value of the entry represents the player that has placed a mark in the field. 0 represents an empty field.
   */
  constructor(
    state: FieldType[][] = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
  ) {
    this.state = state
    this.code = calculateCode(state)
    this.getNormalForm()
  }

  toString(): String {
    let string = ''
    for (const line of this.state) {
      for (const entry of line) {
        string += '|' + symbol(entry)
      }
      string += '|\n'
    }
    return string
  }

  /**
   * Clones the state of the gameboard.
   * @returns a deep copy of the state of the gameboard
   */
  clone(): FieldType[][] {
    const state = this.state
    return [
      [state[0][0], state[0][1], state[0][2]],
      [state[1][0], state[1][1], state[1][2]],
      [state[2][0], state[2][1], state[2][2]]
    ]
  }

  /**
   * Returns the normal form of the gameboard and calculates it if it has not been calculated yet.
   * @returns the normal form of the gameboard
   */
  getNormalForm(): NormalForm {
    if (this.normalForm == -1) {
      this.normalForm = IsomorphismGroup.getNormalFormOfGameBoard(this)
    }
    return this.normalForm
  }

  getCode(): GameBoardCode {
    return this.code
  }
}

/**
 * Calculates the code of a given state. The code is a number that uniquely identifies the state.
 * @param state the state of the gameboard of which the code is to be calculated
 * @returns the code of the given state
 */
export function calculateCode(state: number[][]): number {
  let code = 0
  let base: number = 1
  for (const line of state) {
    for (const entry of line) {
      code += base * entry
      base *= 10
    }
  }
  return code
}

export function getGameBoardFromCode(code: GameBoardCode): GameBoard {
  const state: FieldType[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ]
  let base: number = 1
  let currentSymbol: number
  if (code.toString().length <= 9) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; ++j) {
        currentSymbol = Math.floor((code / base) % 10)
        if (currentSymbol === 0 || currentSymbol === 1 || currentSymbol === 2) {
          state[i][j] = currentSymbol
          base *= 10
        } else {
          throw new Error('Invalid Code')
        }
      }
    }
  } else {
    throw new Error('Invalid Code')
  }
  return new GameBoard(state)
}

export function getPlayerOnTurn(code: GameBoardCode): PlayerNumber {
  const codeString = code.toString()
  let count = 0
  for (const num of codeString) {
    if (num !== '0') {
      count++
    }
  }
  return count % 2 === 0 ? 1 : 2
}
