import type { AIPlayer } from './AIPlayer'
import type { EvaluationPolicy } from './EvaluationPolicy'
import type { GameBoard } from './GameBoard'
import { GameHandler } from './GameHandler'
import { GameSettings } from './GameSettings'
import type { PlayerNumber } from './PlayerNumber'
import { drawStatus } from './WinnerStatus'

export class EliminationPolicy implements EvaluationPolicy {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getInitialWeight(height: number): number {
    return 1
  }
  
  applyPolicy(aI: AIPlayer, history: GameBoard[]): void {
    const handler: GameHandler = GameHandler.getInstance()
    const settings: GameSettings = handler.getSettings()
    const winner = handler.getWinner().value

    if (winner === null || winner === drawStatus) {
      return
    } else if (settings.getPlayer(winner as PlayerNumber) !== aI) {
      const secondLastBoard = history[history.length - 2].getNormalForm()
      const lastBoard = history[history.length - 1].getNormalForm()
  
      const lastMoves = aI.weights.get(secondLastBoard)

      lastMoves?.set(lastBoard, 0)
      for (let index = 3; index < history.length; index++) {
        const board = history[history.length - index].getNormalForm()
        for (const value of aI.weights.get(board)?.values() ?? []) {
          if (value !== 0) {
            return
          }

        }
        aI.weights.get(board)?.set(secondLastBoard, 0)
      }

    }

  }

}
