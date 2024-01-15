import type { Player } from './Player'
export class UserPlayer implements Player {
  name: string

  constructor(name: string) {
    this.name = name
  }

  getName(): string {
    return this.name
  }
  isAI(): boolean {
    return false
  }
  makeMove(): void {
    //do nothing
  }
}
