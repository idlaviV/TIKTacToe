import { HistoryExport } from '../utils/HistoryExport'
import { AIPlayer } from './AIPlayer'
import type { GameBoard } from './GameBoard'
import { GameBoardHandler } from './GameBoardHandler'
import type { PlayerNumber } from './PlayerNumber'
import type { WinnerStatus } from './WinnerStatus'

export class GameHandler {
  playerOnTurn: PlayerNumber = 1
  gBHandler: GameBoardHandler = new GameBoardHandler()
  winner: WinnerStatus = null
  historyExport: HistoryExport = new HistoryExport(this.gBHandler.getGameBoard())
  ai: AIPlayer = new AIPlayer(this) // This is temporary

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
    this.ai.makeMove()
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
