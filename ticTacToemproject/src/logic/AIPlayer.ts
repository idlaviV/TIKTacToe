import { GameBoard } from './GameBoard'
import type { GameHandler } from './GameHandler'
import type { Player } from './Player'
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

  /**
   * Performs a move on the current gameboard.
   * The move is selected by the weights of the AIplayer.
   */
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

  /**
   * Choose a suitable next gameboard, by weights
   * @returns the normal form of the next gameboard
   */
  private pickChildNode(): number {
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

  /**
   * Calculate all possible next boards and structure them as blocks in an array
   * @example for input [(children, weight)] = [(a,1), (b,2), (c,1), (d,0), (e,3)] we obtain 
   * | 1 | 2 | 3 | 4 | 5 | 6 | 7 | index
   * | a |   b   | c |     e     | list of blocks, weight is the width of each block
   *                 ^
   *                 |
   *       d lies between c and e with width 0
   * 
   * If we pick a random index in [1..7], we obtain a random element, weighted by weight
   * This is implemented as an array, where each element is annotated with the last index it covers.
   * This would be a->1, b->3, c->4, d->4 and e->7.
   * @returns The entries of the array specify a child node and the corresponding index.
   */
  private prepareWeightedEntries(): { code: number; index: number }[] {
    const vertexMap: Map<number, number> = this.getVertexMap()
    const weightedEntries = new Array()
    let sum: number = 0
    for (const pair of vertexMap.entries()) {
      sum += pair[1]
      weightedEntries.push({ code: pair[0], index: sum })
    }

    /**
     * If sum == 0, all weights are 0 and the AI has already lost.
     * We then simulate the weights to be all 1 and perform a random move.
     */
    if (sum == 0) {
      for (let i = 0; i < weightedEntries.length; i++) {
        weightedEntries[i].index = i + 1
      }
    }
    return weightedEntries
  }

  /**
   * Extract the weights of the outgoing edges of the current board configuration
   * @returns map of weights
   */
  private getVertexMap(): Map<number, number> {
    const currentNF: number = this.gameHandler.getGBHandler().getGameBoard().getNormalForm()
    if (!this.weights.has(currentNF) || this.weights.get(currentNF) === undefined) {
      this.initializeWeights(currentNF)
    }
    return this.weights.get(currentNF)!
  }

  /**
   * Initializes the weights of the children of a specified node
   * @todo At the moment, all nodes are always set to 1
   * @param code describes the node where weights are missing
   */
  initializeWeights(code: number): void {
    const nextNFs: Set<number> = this.calculateNextNFs()
    const vertexMap = new Map<number, number>()
    this.weights.set(code, vertexMap)
    for (const nextCode of nextNFs) {
      vertexMap.set(nextCode, 1)
    }
  }

  /**
   * Calculate the normal forms of the positions following the current gameboard.
   * @returns a set containing all normal forms
   */
  private calculateNextNFs(): Set<number> {
    const nextNFs: Set<number> = new Set()
    const nextPositions: GameBoard[] = this.gameHandler.getPossibleNextPositions()
    for (const board of nextPositions) {
      nextNFs.add(board.getNormalForm())
    }
    return nextNFs
  }
}
