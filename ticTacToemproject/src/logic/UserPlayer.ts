import { Player } from './Player'

/**
 * This class represents a human player.
 * He triggers moves via the GUI.
 */
export class UserPlayer extends Player {
  constructor(name: string = 'Human') {
    super(name)
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
