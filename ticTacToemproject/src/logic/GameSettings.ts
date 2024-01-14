import type { Player } from './Player'
import type { PlayerNumber } from './PlayerNumber'

/**
 * This class represents all state that is valid during a whole game
 * or state that should be passed between games.
 */
export class GameSettings {
  /**
   * The player that performs the first turn of the game.
   */
  player1: Player
  /**
   * The player that performs the second turn of the game.
   */
  player2: Player

  constructor(player1: Player, player2: Player) {
    this.player1 = player1
    this.player2 = player2
  }

  getPlayer(playerNumber: PlayerNumber): Player {
    if (playerNumber == 1) {
      return this.player1
    } else {
      return this.player2
    }
  }
}
