import type { Player } from './Player'
export class UserPlayer implements Player {
  isAI(): boolean {
    return false
  }
  makeMove(): void {
    //do nothing
  }
}
