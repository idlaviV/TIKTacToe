import { HistoryExport } from '../utils/HistoryExport'
import type { GameBoard } from './GameBoard'
import { GameBoardHandler } from './GameBoardHandler'
import { GameSettings } from './GameSettings'
import type { PlayerNumber } from './PlayerNumber'
import type { WinnerStatus } from './WinnerStatus'
import { AIPlayer } from './AIPlayer'
import { UserPlayer } from './UserPlayer'
import { ref, type Ref } from 'vue'

export class GameHandler {
  private static instance: GameHandler

  playerOnTurn : Ref<PlayerNumber> = ref(1)
  winner : Ref<WinnerStatus> = ref(null)
  gBHandler: GameBoardHandler = new GameBoardHandler()
  historyExport: HistoryExport = new HistoryExport(this.gBHandler.getGameBoard())
  settings: GameSettings = new GameSettings(new UserPlayer(), new AIPlayer(this))
  
  private constructor() {}

  public static getInstance():GameHandler {
    if(!GameHandler.instance) {
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
      this.historyExport.updateHistory(this.gBHandler.getGameBoard())
    }
  }

  performAiTurn() {
    if (this.winner.value == null) {
      this.settings.getPlayer(this.playerOnTurn.value).makeMove()
    }
    console.log("Ai turn")
  }

  performTurnFromUserInput(x: number, y: number) {
    if (!this.settings.getPlayer(this.playerOnTurn.value).isAI()) {
      this.performTurn(x, y)
    }
    console.log("User klick")
    console.log(this.gBHandler.getGameBoard().state)
  }

  resetGame() {
    this.gBHandler.resetGameBoard()
    this.playerOnTurn.value = 1
    this.winner.value = null
    this.historyExport.resetHistory(this.gBHandler.getGameBoard())
  }

  getPossibleNextPositions(): GameBoard[] {
    return this.gBHandler.getPossibleNextPositions(this.playerOnTurn.value)
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


  /**
   * Only for debug purpose
   */
  destroySingleton():void {
    GameHandler.instance = new GameHandler()
  }
}
