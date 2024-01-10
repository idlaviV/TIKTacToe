import type { Player } from './Player'
import type { PlayerNumber } from './PlayerNumber'
export class GameSettings {
  player1: Player
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
