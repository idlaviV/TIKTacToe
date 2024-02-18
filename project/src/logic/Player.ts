/**
 * Represents a player.
 * AIPlayers and UserPlayers are possible.
 */
export abstract class Player {
  name: string

  /**
   * @returns Is this player an AI?
   */
  abstract isAI(): boolean

  /**
   * Prompt this player to directly execute a move on the gameboard.
   */
  abstract makeMove(): void

  /**
   * @returns A name for this player. Only used for visualiszation purposes.
   */
  abstract getName(): string

  wins: number = 0
  losses: number = 0
  draws: number = 0
  games: number = 0

  constructor(name: string) {
    this.name = name
  }

  getStats() {
    return { wins: this.wins, losses: this.losses, draws: this.draws, games: this.games }
  }

  /**
   * Register a player game on this player.
   * @param result Win: 1, Draw: 0, Loss: -1
   */
  playedGame(result: number) {
    this.games++
    switch (result) {
      case 0:
        this.draws++
        break
      case 1:
        this.wins++
        break
      case -1:
        this.losses++
        break
      default:
        throw new Error('Illegal result: ' + result)
    }
  }
}
