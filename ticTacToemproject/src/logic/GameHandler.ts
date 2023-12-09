import { GameBoardHandler } from './GameBoardHandler'
import type { PlayerNumber } from './PlayerNumber'
import type { WinnerStatus } from './WinnerStatus'

export class GameHandler {
  playerOnTurn: PlayerNumber = 1
  gBHandler: GameBoardHandler = new GameBoardHandler()
  winner: WinnerStatus = null

  performTurn(x: number, y: number) {
    this.gBHandler.move(x, y, this.playerOnTurn)
    this.winner = this.gBHandler.calculateWinner()
    if (this.playerOnTurn === 1) {
      this.playerOnTurn = 2
    } else {
      this.playerOnTurn = 1
    }
  }

  resetGame() {
    this.gBHandler.resetGameBoard()
    this.playerOnTurn = 1
    this.winner = null
  }

  getGBHandler(): GameBoardHandler {
    return this.gBHandler
  }

  getPlayerOnTurn(): PlayerNumber {
    return this.playerOnTurn
  }

  getWinner(): WinnerStatus {
    return this.winner
  }
}
