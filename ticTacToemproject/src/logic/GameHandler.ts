import { HistoryExport } from '../utils/HistoryExport'
import type { GameBoard } from './GameBoard'
import { GameBoardHandler } from './GameBoardHandler'
import { GameSettings } from './GameSettings'
import type { PlayerNumber } from './PlayerNumber'
import type { WinnerStatus } from './WinnerStatus'
import { AIPlayer } from './AIPlayer'
import { UserPlayer } from './UserPlayer'

export class GameHandler {
  playerOnTurn: PlayerNumber = 1
  winner: WinnerStatus = null
  gBHandler: GameBoardHandler = new GameBoardHandler()
  historyExport: HistoryExport = new HistoryExport(this.gBHandler.getGameBoard())
  settings: GameSettings = new GameSettings(new UserPlayer(), new AIPlayer(this))

  performTurn(x: number, y: number) {
    if (this.winner == null) {
      this.gBHandler.move(x, y, this.playerOnTurn)
      this.winner = this.gBHandler.calculateWinner()
      if (this.playerOnTurn === 1) {
        this.playerOnTurn = 2
      } else {
        this.playerOnTurn = 1
      }
      this.historyExport.updateHistory(this.gBHandler.getGameBoard())
    }
  }

  performAiTurn() {
    if (this.winner == null) {
      this.settings.getPlayer(this.playerOnTurn).makeMove()
    }
  }

  performTurnFromUserInput(x: number, y: number) {
    if (!this.settings.getPlayer(this.playerOnTurn).isAI()) {
      this.performTurn(x, y)
    }
  }

  resetGame() {
    this.gBHandler.resetGameBoard()
    this.playerOnTurn = 1
    this.winner = null
    this.historyExport.resetHistory(this.gBHandler.getGameBoard())
  }

  getPossibleNextPositions(): GameBoard[] {
    return this.gBHandler.getPossibleNextPositions(this.playerOnTurn)
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

  getHistoryExport(): HistoryExport {
    return this.historyExport
  }
}
