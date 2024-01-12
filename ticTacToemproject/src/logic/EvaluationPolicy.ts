import type { AIPlayer } from './AIPlayer'
import type { GameBoard } from './GameBoard'

export interface EvaluationPolicy {
  getInitialWeight(height: number): number

  applyPolicy(aI: AIPlayer, history: [GameBoard]): void
}
