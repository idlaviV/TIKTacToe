import type { PlayerNumber } from './PlayerNumber'

export class GameBoard {
  state: string[][]
  code: number = -1

  constructor(state: string[][]) {
    this.state = state
    // this.calculateCode()
  }

  // calculateCode() {
  //   this.code = 0
  //   let base: number = 1
  //   for (const line of this.state) {
  //     for (const entry of line) {
  //       this.code += base * entry
  //       base += 10
  //     }
  //   }
  // }

  toString(): String {
    let string = ''
    for (const line of this.state) {
      for (const entry of line) {
        string += '|' + entry
      }
      string += '|\n'
    }
    return string
  }

  getState(): string[][] {
    return this.state
  }

  setState(state: string[][]): void { 
    this.state = state
  }

  getCode(): number {
    return this.code
  }

  setCode(code: number): void {
    this.code = code
  }

  clone(): string[][] {
    return structuredClone(this.state);
  }

  flat(): string[] {
    return this.state.flat()
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
