import type { FieldType } from './FieldType'
import { IsomorphismGroup } from './IsomorphismGroup'

/**
 * This class represents a gameboard. Both the gameboard that can be played on as well as gameboards used in other classes.
 */
export class GameBoard {
  state: FieldType[][]
  code: number = -1
  normalForm: number = -1

  /**
   * This constructor creates a new gameboard. It defaults to an empty gameboard, where all fields are 0.
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
   * This method clones the state of the gameboard.
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
   * This method returns the normal form of the gameboard and calculates it if it has not been calculated yet.
   * @returns the normal form of the gameboard
   */
  getNormalForm(): number {
    if (this.normalForm == -1) {
      this.normalForm = IsomorphismGroup.getNormalFormOfGameBoard(this)
    }
    return this.normalForm
  }

  getCode(): number {
    return this.code
  }
}

/**
 * This function converts a FieldType to it's corresponding symbol.
 * 1 is converted to 'X', 2 is converted to 'O' and 0 is converted to ' '.
 * @param field The FieldType to be converted to a symbol
 * @returns the corresponding symbol
 * @throws an error if the field is neither 1, 2 nor 0
 */
export function symbol(field: FieldType): string {
  if (field == 1) {
    return 'X'
  } else if (field == 2) {
    return '0'
  } else if (field == 0) {
    return ' '
  }
  throw new Error('Unexpected player in field found.')
}

/**
 * This function calculates the code of a given state. The code is a number that uniquely identifies the state.
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
