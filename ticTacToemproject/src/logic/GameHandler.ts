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
import { nextGuiState } from './GuiState'
import { resetHistory, updateHistory } from '@/utils/GraphExport'
import { BackpropagationPolicy } from './BackpropagationPolicy'

/**
 * This class handles the overall game. It is a singleton class.
 */
export class GameHandler {
  private static instance: GameHandler

  playerOnTurn: Ref<PlayerNumber> = ref(1)
  winner: Ref<WinnerStatus> = ref(null)
  gBHandler: GameBoardHandler = new GameBoardHandler()

  gameCount:number = 0

  humanPlayer: UserPlayer = new UserPlayer('Mensch')
  /**
   * The possible options for players.
   * Contains all AIs and the option for the user to play.
   */
  possiblePlayers: Player[] = [
    this.humanPlayer,
    new AIPlayer(new EliminationPolicy(), 'KI-Elimination'),
    new AIPlayer(new BackpropagationPolicy(), 'KI-Fehlerrückführung')
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
    updateHistory(this.gBHandler.getGameBoard())
  }

  /**
   * Performs the actions that have to be done at the end of a game.
   * @param applyPolicy whether the policy shall be applied or not
   */
  performEndOfGameActions(applyPolicy: boolean) {
    this.gameCount++
    if (this.gameCount % 100 == 0) {
      console.log(this.gameCount + " " +  Date.now())
    }
    if (applyPolicy) {
      this.settings.getPlayer(1).isAI()
        ? (this.settings.getPlayer(1) as AIPlayer).applyPolicy()
        : null
      this.settings.getPlayer(2).isAI() && this.settings.getPlayer(2) !== this.settings.getPlayer(1)
        ? (this.settings.getPlayer(2) as AIPlayer).applyPolicy()
        : null
    }
    this.resetGame()
    nextGuiState()
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
   */
  createAI(selectedAIOption: number, name: string) {
    if (selectedAIOption === 0) {
      this.possiblePlayers.push(new AIPlayer(new EliminationPolicy(), name))
    } else if (selectedAIOption === 1) {
      this.possiblePlayers.push(new AIPlayer(new BackpropagationPolicy(), name))
    } else {
      throw new Error('Invalid AI option')
    }
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
    resetHistory()
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

  getNumberOfAIs(): number {
    let count: number = 0
    if (this.settings.getPlayer(1).isAI()) count++
    if (this.settings.getPlayer(2).isAI()) count++
    return count
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
