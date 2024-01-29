import type { AIPlayer } from './AIPlayer'
import type { NormalForm } from './Codes'
import type { EvaluationPolicy } from './EvaluationPolicy'
import type { GameBoard } from './GameBoard'
import { GameHandler } from './GameHandler'
import { drawStatus } from './WinnerStatus'

/**
 * This class implements the {@link EvaluationPolicy} interface.
 * It models a policy that punishes and rewards moves based on the outcome of the game.
 */
export class BackpropagationPolicy implements EvaluationPolicy {
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
    if (0 <= height && height <= 8) {
      return 8 - height
    } else {
      throw new Error('Height must be between 0 and 8')
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
    }

    let possibleMoves: Map<NormalForm, number>
    let diff = this.drawDiff
    for (let index = history.length - 1; index > 0; index--) {
      possibleMoves = aI.getVertexMap(history[index - 1].getNormalForm())

      if (winner.value !== drawStatus) {
        diff = index % 2 === (history.length - 1) % 2 ? this.winDiff : this.loseDiff
      }

      possibleMoves.set(
        history[index].getNormalForm(),
        possibleMoves.get(history[index].getNormalForm())! + diff
      )

      if (possibleMoves.get(history[index].getNormalForm())! < 0) {
        possibleMoves.set(history[index].getNormalForm(), 0)
      }
    }
  }
}
