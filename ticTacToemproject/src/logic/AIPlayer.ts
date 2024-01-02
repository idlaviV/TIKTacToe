import { GameBoard } from './GameBoard'
import type { GameHandler } from './GameHandler'
import type { Player } from './IPlayer'
export class AIPlayer implements Player {
  weights: Map<number, Map<number, number>> = new Map()
  gameHandler: GameHandler

  constructor(gHandler: GameHandler) {
    this.gameHandler = gHandler
  }

  isAI(): boolean {
    return true
  }

  makeMove(): void {
    const currentNF: number = this.gameHandler.getGBHandler().getGameBoard().getNormalForm()
    if (!this.weights.has(currentNF) || this.weights.get(currentNF) === undefined) {
      this.initializeWeights(currentNF)
    }

    const vertexMap: Map<number, number> = this.weights.get(currentNF)!
    const weightedEntries = new Array()
    let sum: number = 0
    for (const pair of vertexMap.entries()) {
        sum += pair[1]
        weightedEntries.push({code : pair[0], index:sum})
    }
    if(sum == 0) {
        for (const index in weightedEntries) {
            weightedEntries[index].index = index
            sum = weightedEntries.length
        }
    }
    const randomIndex = this.randomInteger(1, sum)
    for (const entry of weightedEntries) {
        if (entry.index >= randomIndex) {
            const nextBoard: GameBoard = this.gameHandler.getPossibleNextPositions().find(
                (gameBoard) => gameBoard.getNormalForm() == entry.index)!
            const currentBoard : GameBoard = this.gameHandler.getGBHandler().getGameBoard()
            for (const y of [0,1,2]) {
                for (const x of [0,1,2]) {
                    if(nextBoard.state[y][x] !== currentBoard.state[y][x]) {
                        this.gameHandler.performTurn(x,y)
                        return
                    }
                }
            }
            
        }
    }
  }

  private calculateNextNFs(): Set<number> {
    const nextNFs: Set<number> = new Set()
    const nextPositions: GameBoard[] = this.gameHandler.getPossibleNextPositions()
    for (const board of nextPositions) {
      nextNFs.add(board.getNormalForm())
    }
    return nextNFs
  }

  private initializeWeights(code: number): void {
    const nextNFs: Set<number> = this.calculateNextNFs()
    const vertexMap = new Map<number, number>()
    this.weights.set(code, vertexMap)
    for (const nextCode of nextNFs) {
      vertexMap.set(nextCode, 1)
    }
  }

  randomInteger(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

