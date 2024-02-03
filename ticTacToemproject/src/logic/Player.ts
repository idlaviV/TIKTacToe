/**
 * Represents a player.
 * AIPlayers and UserPlayers are possible.
 */
export abstract class Player {
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

}
