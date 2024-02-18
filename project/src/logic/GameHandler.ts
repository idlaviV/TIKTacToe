import type { GameBoard } from './GameBoard'
import { GameBoardHandler, MoveError } from './GameBoardHandler'
import { GameSettings } from './GameSettings'
import type { PlayerNumber } from './PlayerNumber'
import { drawStatus, type WinnerStatus } from './WinnerStatus'
import { AIPlayer } from './AIPlayer'
import { UserPlayer } from './UserPlayer'
import type { GameBoardWithPrevMove } from './Moves'
import { ref, type Ref } from 'vue'
import { EliminationPolicySimple } from './EliminationPolicySimple'
import type { Player } from './Player'
import { updatePlayerList } from '@/utils/PlayerListExport'
import { resetHistory, updateHistory } from '@/utils/GraphExport'
import { BackpropagationPolicy } from './BackpropagationPolicy'
import { EliminationPolicyImproved } from './EliminationPolicyImproved'
import { updateLabels } from '@/utils/LabelExport'
import type { TTTEdges } from '@/utils/Graph'
import { nextGuiState, skipEvaluationScreen } from './GuiState'
import { resetTimer } from './AutoPlayTimer'

/**
 * This class handles the overall game. It is a singleton class.
 */
export class GameHandler {
  private static instance: GameHandler

  playerOnTurn: Ref<PlayerNumber> = ref(1)
  winner: Ref<WinnerStatus> = ref(null)
  gBHandler: GameBoardHandler = new GameBoardHandler()

  gameCount: number = 0

  humanPlayer: UserPlayer = new UserPlayer('Mensch')
  /**
   * The possible options for players.
   * Contains all AIs and the option for the user to play.
   */
  possiblePlayers: Player[] = [
    this.humanPlayer,
    new AIPlayer(new EliminationPolicySimple(), 'KI-Elimination'),
    new AIPlayer(new BackpropagationPolicy(), 'KI-Rückführung'),
    new AIPlayer(new EliminationPolicyImproved(), 'KI-Elimination v2.0')
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
      this.performEndOfTurnActions()
    }
  }

  /**
   * Performs the actions that have to be done at the end of a gameturn.
   */
  performEndOfTurnActions() {
    this.winner.value = this.gBHandler.calculateWinner()
    this.playerOnTurn.value = this.playerOnTurn.value === 1 ? 2 : 1
    updateHistory(this.gBHandler.getGameBoard())
    if (
      this.winner.value !== null &&
      (!skipEvaluationScreen.value || this.getNumberOfAIs() === 0)
    ) {
      nextGuiState()
    }
  }

  /**
   * Performs the actions that have to be done at the end of a game.
   * @param applyPolicy whether the policy shall be applied or not
   */
  performEndOfGameActions(applyPolicy: boolean) {
    this.gameCount++
    if (this.gameCount % 100 == 0) {
      console.log(this.gameCount + ' ' + Date.now())
    }
    this.registerGamesInStats()
    if (applyPolicy) {
      this.applyPolicies()
    }
  }

  /**
   * Apply the policies of the AIs and updates the labels in the labelExport.
   */
  private applyPolicies() {
    let changedWeights: TTTEdges
    changedWeights = this.settings.getPlayer(1).isAI()
      ? (this.settings.getPlayer(1) as AIPlayer).applyPolicy()
      : {}
    updateLabels(changedWeights, 0)
    changedWeights =
      this.settings.getPlayer(2).isAI() && this.settings.getPlayer(2) !== this.settings.getPlayer(1)
        ? (this.settings.getPlayer(2) as AIPlayer).applyPolicy()
        : {}
    updateLabels(changedWeights, 1)
  }

  private registerGamesInStats() {
    switch (this.winner.value) {
      case drawStatus:
        this.settings.getPlayer(1).playedGame(0)
        this.settings.getPlayer(2).playedGame(0)
        break
      case 1:
        this.settings.getPlayer(1).playedGame(1)
        this.settings.getPlayer(2).playedGame(-1)
        break
      case 2:
        this.settings.getPlayer(1).playedGame(-1)
        this.settings.getPlayer(2).playedGame(1)
        break
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
    try {
      if (!this.settings.getPlayer(this.playerOnTurn.value).isAI()) {
        this.performTurn(x, y)
        resetTimer()
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
      this.possiblePlayers.push(new AIPlayer(new EliminationPolicySimple(), name))
    } else if (selectedAIOption === 1) {
      this.possiblePlayers.push(new AIPlayer(new BackpropagationPolicy(), name))
    } else if (selectedAIOption === 2) {
      this.possiblePlayers.push(new AIPlayer(new EliminationPolicyImproved(), name))
    } else {
      throw new Error('Invalid AI option')
    }
    updatePlayerList()
  }

  /**
   * Reset the weights of an AI.
   * Cannot be used for user player (which has index 0).
   * @param aiIndex the index of the AI to be resetted
   */
  resetAiWeights(aiIndex: number) {
    if (aiIndex < 0 || aiIndex >= this.possiblePlayers.length) {
      throw new Error('This player is not known.')
    }
    const ai = this.possiblePlayers[aiIndex]
    if (ai instanceof AIPlayer) {
      ai.resetWeights()
    } else {
      throw new Error('Player is not an AI.')
    }
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

  arePlayersTheSame():boolean {
    return this.settings.getPlayer(1) === this.settings.getPlayer(2)
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

  getSettings(): GameSettings {
    return this.settings
  }

  /**
   * Only for debug purpose
   */
  destroySingleton(): void {
    GameHandler.instance = new GameHandler()
  }
}
