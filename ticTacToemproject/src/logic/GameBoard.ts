import type { PlayerNumber } from './PlayerNumber'

export class GameBoard {
  state: number[][]
  code: number = -1

  constructor(state: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]) {
    this.state = state
    this.calculateCode()
  }

  calculateCode() {
    this.code = 0
    let base: number = 1
    for (const line of this.state) {
      for (const entry of line) {
        this.code += base * entry
        base += 10
      }
    }
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

  clone(): number[][] {
    const state = this.state
    return [
      [state[0][0], state[0][1], state[0][2]],
      [state[1][0], state[1][1], state[1][2]],
      [state[2][0], state[2][1], state[2][2]]
    ]
  }
}

function symbol(field: number): FieldType {
  if (field == 1) {
    return 1
  } else if (field == 2) {
    return 2
  } else if (field == 0) {
    return ' '
  }
  throw new Error('Unexpected player in field found.')
}

type FieldType = PlayerNumber | ' '
