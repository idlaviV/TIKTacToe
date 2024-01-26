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
    const winner = GameHandler.getInstance().getWinner()

    if (winner.value === null) {
      return
    } else {
      let possibleMoves: Map<NormalForm, number>
      let nextMove: NormalForm
      for (let index = history.length - 1; index > 0; index--) {
        possibleMoves = aI.getVertexMap(history[index - 1].getNormalForm())
        nextMove = history[index].getNormalForm()

        if (winner.value === drawStatus) {
          this.setWeights(possibleMoves, this.drawDiff, nextMove)
        } else if (winner.value === 1) {
          this.setWeights(possibleMoves, index % 2 === 1 ? this.winDiff : this.loseDiff, nextMove)
        } else {
          this.setWeights(possibleMoves, index % 2 === 0 ? this.winDiff : this.loseDiff, nextMove)
        }

        if (possibleMoves.get(history[index].getNormalForm())! < 0) {
          possibleMoves.set(history[index].getNormalForm(), 0)
        }
      }
    }
  }

  private setWeights(possibleMoves: Map<NormalForm, number>, diff: number, move: NormalForm): void {
    possibleMoves.set(
      move,
      possibleMoves.get(move)! + diff
    )
  }
}

