import { HistoryExport } from '../utils/HistoryExport'
import type { GameBoard } from './GameBoard'
import { GameBoardHandler } from './GameBoardHandler'
import { GameSettings } from './GameSettings'
import type { PlayerNumber } from './PlayerNumber'
import type { WinnerStatus } from './WinnerStatus'
import { AIPlayer } from './AIPlayer'
import { UserPlayer } from './UserPlayer'
import type { GameBoardWithPrevMove } from './Moves'
import { ref, type Ref } from 'vue'
import { HistoryWithChildsExport } from '@/utils/HistoryWithChildsExport'

export class GameHandler {
  private static instance: GameHandler

  playerOnTurn: Ref<PlayerNumber> = ref(1)
  winner: Ref<WinnerStatus> = ref(null)
  gBHandler: GameBoardHandler = new GameBoardHandler()
  settings: GameSettings = new GameSettings(new UserPlayer(), new AIPlayer())
  historyExport: HistoryExport = new HistoryExport(this.gBHandler.getGameBoard())
  historyWithChildsExport: HistoryWithChildsExport = new HistoryWithChildsExport(this.historyExport)

  private constructor() {}

  public static getInstance(): GameHandler {
    if (!GameHandler.instance) {
      GameHandler.instance = new GameHandler()
    }
    return GameHandler.instance
  }

  performTurn(x: number, y: number) {
    if (this.winner.value == null) {
      this.gBHandler.move(x, y, this.playerOnTurn.value)
      this.winner.value = this.gBHandler.calculateWinner()
      if (this.playerOnTurn.value === 1) {
        this.playerOnTurn.value = 2
      } else {
        this.playerOnTurn.value = 1
      }
      this.historyWithChildsExport.updateHistory(this.gBHandler.getGameBoard())
    }
  }

  performAiTurn() {
    if (this.winner.value == null) {
      this.settings.getPlayer(this.playerOnTurn.value).makeMove()
    }
  }

  performTurnFromUserInput(x: number, y: number) {
    if (!this.settings.getPlayer(this.playerOnTurn.value).isAI()) {
      this.performTurn(x, y)
    }
  }

  resetGame() {
    this.gBHandler.resetGameBoard()
    this.playerOnTurn.value = 1
    this.winner.value = null
    this.historyWithChildsExport.resetHistory(this.gBHandler.getGameBoard())
  }

  getPossibleNextPositionsWithMoves(): GameBoardWithPrevMove[] {
    return this.gBHandler.getPossibleNextPositions(this.playerOnTurn.value)
  }

  getPossibleNextPositions(): GameBoard[] {
    const boards: GameBoard[] = []
    const possibleNextPositions: GameBoardWithPrevMove[] = this.getPossibleNextPositionsWithMoves()
    for (const position of possibleNextPositions) {
      boards.push(position[0])
    }
    return boards
  }

  getGBHandler(): GameBoardHandler {
    return this.gBHandler
  }

  getPlayerOnTurn(): Ref<PlayerNumber> {
    return this.playerOnTurn
  }

  getWinner(): Ref<WinnerStatus> {
    return this.winner
  }

  getHistoryExport(): HistoryExport {
    return this.historyExport
  }

  getHistoryWithChildsExport(): HistoryWithChildsExport {
    return this.historyWithChildsExport
  }

  /**
   * Only for debug purpose
   */
  destroySingleton(): void {
    GameHandler.instance = new GameHandler()
  }
}
