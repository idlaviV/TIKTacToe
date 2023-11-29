import type { PlayerNumber } from './PlayerNumber'

export class GameBoard {
  state: number[][]
  code: number = -1

  constructor(state: number[][]) {
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

  reset() {
    this.state = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]
    this.code = -1
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
    return structuredClone(this.state);
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
