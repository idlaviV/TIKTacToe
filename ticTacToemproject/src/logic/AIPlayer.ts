import { GameBoard } from './GameBoard'
import type { GameHandler } from './GameHandler'
import type { Player } from './IPlayer'
import { Randomizer } from './Randomizer'
export class AIPlayer implements Player {
  weights: Map<number, Map<number, number>> = new Map()
  gameHandler: GameHandler
  randomzier: Randomizer = new Randomizer()

  constructor(gHandler: GameHandler) {
    this.gameHandler = gHandler
  }

  isAI(): boolean {
    return true
  }

  private getVertexMap(): Map<number, number> {
    const currentNF: number = this.gameHandler.getGBHandler().getGameBoard().getNormalForm()
    if (!this.weights.has(currentNF) || this.weights.get(currentNF) === undefined) {
      this.initializeWeights(currentNF)
    }
    return this.weights.get(currentNF)!
  }

  prepareWeightedEntries() {
    const vertexMap: Map<number, number> = this.getVertexMap()
    const weightedEntries = new Array()
    let sum: number = 0
    for (const pair of vertexMap.entries()) {
      sum += pair[1]
      weightedEntries.push({ code: pair[0], index: sum })
    }
    if (sum == 0) {
      for (let i = 0; i < weightedEntries.length; i++) {
        weightedEntries[i].index = i + 1
        sum = weightedEntries.length
      }
    }
    return weightedEntries
  }

  pickChildNode(): number {
    const weightedEntries = this.prepareWeightedEntries()
    const randomIndex = this.randomzier.randomInteger(
      1,
      weightedEntries[weightedEntries.length - 1].index
    )
    for (const entry of weightedEntries) {
      if (entry.index >= randomIndex) {
        return entry.code
      }
    }
    throw new Error('No legal move could be calculated.')
  }

  makeMove(): void {
    const newNormalForm: number = this.pickChildNode()
    const options: GameBoard[] = this.gameHandler
      .getPossibleNextPositions()
      .filter((gameBoard) => gameBoard.getNormalForm() == newNormalForm)!
    const min = Math.min(...options.map((item) => item.code))
    const newBoard = options.find((gameBoard) => gameBoard.getCode() == min)!
    const currentBoard: GameBoard = this.gameHandler.getGBHandler().getGameBoard()
    for (const y of [0, 1, 2]) {
      for (const x of [0, 1, 2]) {
        if (newBoard.state[x][y] !== currentBoard.state[x][y]) {
          this.gameHandler.performTurn(x, y)
          return
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

  initializeWeights(code: number): void {
    const nextNFs: Set<number> = this.calculateNextNFs()
    const vertexMap = new Map<number, number>()
    this.weights.set(code, vertexMap)
    for (const nextCode of nextNFs) {
      vertexMap.set(nextCode, 1)
    }
  }
}
