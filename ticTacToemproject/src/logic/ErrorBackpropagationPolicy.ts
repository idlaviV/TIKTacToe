import type { AIPlayer } from './AIPlayer'
import type { EvaluationPolicy } from './EvaluationPolicy'
import type { GameBoard } from './GameBoard'
import { GameHandler } from './GameHandler'
import { drawStatus } from './WinnerStatus'

/**
 * This class implements the {@link EvaluationPolicy} interface.
 * It models a policy that punishes and rewards moves based on the outcome of the game.
 */
export class ErrorBackpropagationPolicy implements EvaluationPolicy {
  handler = GameHandler.getInstance()

  winDiff: number
  drawDiff: number
  loseDiff: number

  constructor(winDiff: number = 3, drawDiff: number = 1, loseDiff: number = -1) {
    this.winDiff = winDiff
    this.drawDiff = drawDiff
    this.loseDiff = loseDiff
  }

  setDiffs(winDiff: number, drawDiff: number, loseDiff: number): void {
    this.winDiff = winDiff
    this.drawDiff = drawDiff
    this.loseDiff = loseDiff
  }

  /**
   * @inheritdoc
   * @override
   */
  getInitialWeight(height: number): number {
    if (0 <= height && height < 8) {
      return 8 - height
    } else {
      throw new Error('Height must be between 0 and 7')
    }
  }

  /**
   * Applies the backpropagation policy to the given AIPlayer.
   * If the game ends, the weights of all moves that lead to this outcome are changed by winDiff, drawDiff or loseDiff respectively.
   *
   * @inheritdoc
   * @override
   */
  applyPolicy(aI: AIPlayer, history: GameBoard[]): void {
    const winner = this.handler.getWinner()

    if (winner.value === null) {
      return
    } else if (winner.value === drawStatus) {
      this.applyDrawPolicy(aI, history)
    } else {
      this.applyWinningPolicy(aI, history)
    }
  }

  private applyDrawPolicy(aI: AIPlayer, history: GameBoard[]): void {
    for (let index = history.length - 1; index > 0; index--) {
      aI.getVertexMap(history[index - 1].getNormalForm()).set(
        history[index - 1].getNormalForm(),
        aI.getVertexMap(history[index - 1].getNormalForm()).get(history[index].getNormalForm())! +
          this.drawDiff
      )
    }
  }

  private applyWinningPolicy(aI: AIPlayer, history: GameBoard[]): void {
    for (let index = history.length - 1; index > 0; index--) {
      aI.getVertexMap(history[index - 1].getNormalForm()).set(
        history[index].getNormalForm(),
        aI.getVertexMap(history[index - 1].getNormalForm()).get(history[index].getNormalForm())! +
          (index % 2 === (history.length - 1) % 2 ? this.winDiff : this.loseDiff)
      )
    }
  }
}
