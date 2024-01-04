import type { Player } from './IPlayer'
export class UserPlayer implements Player {
  isAI(): boolean {
    return false
  }
  makeMove(): void {
    //do nothing
  }
}
