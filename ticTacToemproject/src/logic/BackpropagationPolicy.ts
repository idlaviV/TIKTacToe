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
  /**
   * The three parameters are the values that are added to weights of an AI if a game was
   * won, drawn or lost, respectively.
   * They are supposed to be integers and their maximum absolute value is bounded.
   */
  winDiff: number
  drawDiff: number
  loseDiff: number
  readonly bound: number = 1000

  constructor(winDiff: number = 3, drawDiff: number = 1, loseDiff: number = -1) {
    this.validateDiffs(winDiff, drawDiff, loseDiff)
    this.winDiff = winDiff
    this.drawDiff = drawDiff
    this.loseDiff = loseDiff
  }

  /**
   * Sets the values that are added to the weights of the AI.
   * If the value is not an int, it is not set.
   * If the value is higher than 1000 or lower than -1000, it will be set to 1000/-1000.
   * @param winDiff the new winDiff value
   * @param drawDiff the new drawDiff value
   * @param loseDiff the new loseDiff value
   */
  setDiffs(winDiff: number, drawDiff: number, loseDiff: number): void {
    const newWinDiff = this.sanitizeDiffValue(winDiff)
    const newDrawDiff = this.sanitizeDiffValue(drawDiff)
    const newLoseDiff = this.sanitizeDiffValue(loseDiff)

    if (!isNaN(newWinDiff)) {
      this.winDiff = newWinDiff
    }
    if (!isNaN(newDrawDiff)) {
      this.drawDiff = newDrawDiff
    }
    if (!isNaN(newLoseDiff)) {
      this.loseDiff = newLoseDiff
    }
  }

  /**
   * Checks, if the value is valid for a diff value.
   * @param diff the value to be validated
   * @returns If the value is no int: return NaN
   *          If the value is higher than 1000: return 1000
   *          If the value is lower than -1000: return -1000
   *          Else: return diff
   */
  private sanitizeDiffValue(diff: number) {
    const maxDiff = 1000
    if (Number.isInteger(diff)) {
      if (diff > maxDiff) {
        return maxDiff
      } else if (diff < -maxDiff) {
        return -maxDiff
      } else {
        return diff
      }
    } else {
      return NaN
    }
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
      }
    }
  }

  private setWeights(possibleMoves: Map<NormalForm, number>, diff: number, move: NormalForm): void {
    possibleMoves.set(move, possibleMoves.get(move)! + diff)
    if (possibleMoves.get(move)! < 0) {
      possibleMoves.set(move, 0)
    }
  }

  private validateDiffs(winDiff: number, drawDiff: number, loseDiff: number) {
    if (isNaN(this.sanitizeDiffValue(winDiff))) {
      throw new Error('winDiff ' + winDiff + ' is illegal')
    }
    if (isNaN(this.sanitizeDiffValue(drawDiff))) {
      throw new Error('drawDiff ' + drawDiff + ' is illegal')
    }
    if (isNaN(this.sanitizeDiffValue(drawDiff))) {
      throw new Error('loseDiff ' + drawDiff + ' is illegal')
    }
    if (
      Math.max(winDiff, drawDiff, loseDiff) > this.bound &&
      Math.min(winDiff, drawDiff, loseDiff) < -this.bound
    ) {
      throw new Error('Diffs (' + winDiff + ',' + drawDiff + ',' + loseDiff + ') out of bound!')
    }
  }
}
