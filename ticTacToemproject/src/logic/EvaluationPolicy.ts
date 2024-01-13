import type { AIPlayer } from './AIPlayer'
import type { GameBoard } from './GameBoard'

/**
 * This interface represents a policy that can be applied to an {@link AIPlayer}.
 *
 * @interface
 */
export interface EvaluationPolicy {
  /**
   * Calculates the initial weight for a given height in the graph of possible gameBoards. It is dependent on the policy chosen.
   * @param height the height of the graph at which the initial weight is to be calculated
   * @returns the initial weight for the given height
   */
  getInitialWeight(height: number): number

  /**
   * This method applies the chosen policy to the given AIPlayer.
   * @param aI The AIPlayer to which the policy is applied
   * @param history The history of the game
   */
  applyPolicy(aI: AIPlayer, history: [GameBoard]): void
}
