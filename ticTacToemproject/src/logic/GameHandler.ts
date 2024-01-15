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
import { EliminationPolicy } from './EliminationPolicy'
import type { Player } from './Player'

/**
 * This class handles the overall game. It is a singleton class.
 */
export class GameHandler {
  private static instance: GameHandler

  playerOnTurn: Ref<PlayerNumber> = ref(1)
  winner: Ref<WinnerStatus> = ref(null)
  gBHandler: GameBoardHandler = new GameBoardHandler()
  historyExport: HistoryExport = new HistoryExport(this.gBHandler.getGameBoard())
  humanPlayer: UserPlayer = new UserPlayer('Human')
  possiblePlayers: Player[] = [
    this.humanPlayer,
    new AIPlayer(new EliminationPolicy(), 'AI'),
    new AIPlayer(new EliminationPolicy(), 'AI2')
  ]

  settings: GameSettings = new GameSettings(this.humanPlayer, this.possiblePlayers[1])

  private constructor() {}

  /**
   * Returns the instance of the singleton.
   * If the instance does not exist yet, it will be created.
   * @returns the instance of the singleton
   */
  public static getInstance(): GameHandler {
    if (!GameHandler.instance) {
      GameHandler.instance = new GameHandler()
    }
    return GameHandler.instance
  }

  /**
   * Performs a turn, by either an AI or a user.
   * @param x the x coordinate of the piece to be added
   * @param y the y coordinate of the piece to be added
   */
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

  /**
   * Performs a turn by an AI.
   * If a user is on turn, nothing happens.
   */
  performAiTurn() {
    if (this.winner.value == null) {
      this.settings.getPlayer(this.playerOnTurn.value).makeMove()
    }
  }

  /**
   * Performs a turn by a user.
   * If an AI is on turn, nothing happens.
   * @param x the x coordinate of the piece to be added
   * @param y the y coordinate of the piece to be added
   */
  performTurnFromUserInput(x: number, y: number) {
    if (!this.settings.getPlayer(this.playerOnTurn.value).isAI()) {
      this.performTurn(x, y)
    }
  }

  setPlayers(index1: number, index2: number) {
    this.settings.setPlayers(this.possiblePlayers[index1], this.possiblePlayers[index2])
  }

  resetGame() {
    this.gBHandler.resetGameBoard()
    this.playerOnTurn.value = 1
    this.winner.value = null
    this.historyExport.resetHistory(this.gBHandler.getGameBoard())
  }

  /**
   * Returns all possible next positions with the moves that lead to them.
   * They are given as an array of {@link GameBoardWithPrevMove}.
   * @returns all possible next positions with the moves that lead to them
   */
  getPossibleNextPositionsWithMoves(): GameBoardWithPrevMove[] {
    return this.gBHandler.getPossibleNextPositions(this.playerOnTurn.value)
  }

  /**
   * Returns only the next possible positions, without the moves that lead to them.
   * @returns all possible next positions
   */
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

  getPossiblePlayers(): Player[] {
    return this.possiblePlayers
  }

  getUserPlayer(): UserPlayer {
    return this.humanPlayer
  }

  /**
   * Only for debug purpose
   */
  destroySingleton(): void {
    GameHandler.instance = new GameHandler()
  }
}
