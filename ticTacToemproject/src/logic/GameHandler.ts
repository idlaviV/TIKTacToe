import { HistoryExport } from '../utils/HistoryExport'
import type { GameBoard } from './GameBoard'
import { GameBoardHandler, MoveError } from './GameBoardHandler'
import { GameSettings } from './GameSettings'
import type { PlayerNumber } from './PlayerNumber'
import type { WinnerStatus } from './WinnerStatus'
import { AIPlayer } from './AIPlayer'
import { UserPlayer } from './UserPlayer'
import type { GameBoardWithPrevMove } from './Moves'
import { ref, type Ref } from 'vue'
import { EliminationPolicy } from './EliminationPolicy'
import type { Player } from './Player'
import { updatePlayerList } from '@/utils/PlayerListExport'
import { setGUiState } from './GuiState'

/**
 * This class handles the overall game. It is a singleton class.
 */
export class GameHandler {
  private static instance: GameHandler

  playerOnTurn: Ref<PlayerNumber> = ref(1)
  winner: Ref<WinnerStatus> = ref(null)
  gBHandler: GameBoardHandler = new GameBoardHandler()

  historyExport: HistoryExport = new HistoryExport(this.gBHandler.getGameBoard())
  humanPlayer: UserPlayer = new UserPlayer('Mensch')
  /**
   * The possible options for players.
   * Contains all AIs and the option for the user to play.
   */
  possiblePlayers: Player[] = [
    this.humanPlayer,
    new AIPlayer(new EliminationPolicy(), 'KI'),
    new AIPlayer(new EliminationPolicy(), 'KI 2')
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
      this.performEndOfTurnActions()
    }
  }

  /**
   * Performs the actions that have to be done at the end of a gameturn.
   */
  performEndOfTurnActions() {
    this.playerOnTurn.value = this.playerOnTurn.value === 1 ? 2 : 1
    this.historyExport.updateHistory(this.gBHandler.getGameBoard())
  }
  
  /**
   * Performs the actions that have to be done at the end of a game.
   */
  performEndOfGameActions() {
    this.settings.getPlayer(1).isAI()
      ? (this.settings.getPlayer(1) as AIPlayer).applyPolicy()
      : null
    this.settings.getPlayer(2).isAI() && this.settings.getPlayer(2) !== this.settings.getPlayer(1)
      ? (this.settings.getPlayer(2) as AIPlayer).applyPolicy()
      : null

    // Sets the screen to the selection screen, in the end this should set to the evaluation screen, unless skipped
    setGUiState('start')
    this.resetGame()
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
    try {
      if (!this.settings.getPlayer(this.playerOnTurn.value).isAI()) {
        this.performTurn(x, y)
      }
    } catch (e: unknown) {
      if (e instanceof MoveError) {
        //do nothing, as the user player has the right to make a wrong move
      } else {
        throw e
      }
    }
  }

  /**
   * Adds a new AI to the list of possible players.
   * @param selectedAIOption For later selection of AI type. Currently not used.
   * @param name A chosen name for the AI. Does not have to be unique.
   * @todo Implement selectedAIOption. Atm, EliminationPolicy is used by default.
   */
  createAI(selectedAIOption: number, name: string) {
    this.possiblePlayers.push(new AIPlayer(new EliminationPolicy(), name))
    updatePlayerList()
  }

  /**
   * Registers chosen players as player1 and player2 for the next game.
   * @param index_ index of the chosen option
   */
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

  /**
   * Only for debug purpose
   */
  destroySingleton(): void {
    GameHandler.instance = new GameHandler()
  }
}
