import type { Player } from './Player'

/**
 * This class represents a human player.
 * He triggers moves via the GUI.
 */
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
