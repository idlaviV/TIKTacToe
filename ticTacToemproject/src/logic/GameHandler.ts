import { GameBoardHandler } from './GameBoardHandler'
import type { PlayerNumber } from './PlayerNumber'

export class GameHandler {
  playerOnTurn: PlayerNumber = 1
  gBHandler: GameBoardHandler = new GameBoardHandler()

  performTurn(x: number, y: number) {
    this.gBHandler.move(x, y, this.playerOnTurn)
    if (this.playerOnTurn === 1) {
      this.playerOnTurn = 2
    } else {
      this.playerOnTurn = 1
    }
  }

  resetGame() {
    this.gBHandler.resetGameBoard()
    this.playerOnTurn = 1
  }

  getGBHandler(): GameBoardHandler {
    return this.gBHandler
  }

  getPlayerOnTurn(): PlayerNumber {
    return this.playerOnTurn
  }
}
