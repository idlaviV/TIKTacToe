export interface Player {
  /**
   * @returns Is this player an AI?
   */
  isAI(): boolean

  /**
   * Prompt this player to directly execute a move on the board
   *
   */
  makeMove(): void
}
