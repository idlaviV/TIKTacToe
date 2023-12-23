import type { PlayerNumber } from './PlayerNumber'

export class GameBoard {
  state: FieldType[][]
  code: number = -1

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

  clone(): FieldType[][] {
    const state = this.state
    return [
      [state[0][0], state[0][1], state[0][2]],
      [state[1][0], state[1][1], state[1][2]],
      [state[2][0], state[2][1], state[2][2]]
    ]
  }

  getCode(): number {
    return this.code
  }
}

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

export type FieldType = PlayerNumber | 0
