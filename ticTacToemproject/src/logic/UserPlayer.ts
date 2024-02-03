import  { Player } from './Player'

/**
 * This class represents a human player.
 * He triggers moves via the GUI.
 */
export class UserPlayer extends Player {
  name: string

  constructor(name: string = 'Human') {
    super()
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
