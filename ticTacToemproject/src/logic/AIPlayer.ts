import type { GameBoardCode, NormalForm } from './Codes'
import type { EvaluationPolicy } from './EvaluationPolicy'
import { calculateNextNFs } from './GameBoardHandler'
import { GameHandler } from './GameHandler'
import type { GameBoardWithPrevMove } from './Moves'
import type { Player } from './Player'
import { Randomizer } from './Randomizer'

/**
 * This class represents an AI player.
 * Its behaviour is based on the weights of possible moves.
 */
export class AIPlayer implements Player {
  /**
   * The weights are an edge-label on the gamegraph, where vertices are gameboards and edges are moves.
   * The weights are stored in a map, where gameboards are passed using their normal form.
   * The first input for the weights map is the parent gameboard, the second input is the child gameboard.
   */
  weights: Map<NormalForm, Map<NormalForm, number>> = new Map()
  /**
   * The randomizer provides a choice for a random number.
   */
  randomizer: Randomizer = new Randomizer()
  policy: EvaluationPolicy
  name: string

  constructor(policy: EvaluationPolicy, name: string = 'AI') {
    this.name = name
    this.policy = policy
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
    const options: GameBoardWithPrevMove[] = GameHandler.getInstance()
      .getPossibleNextPositionsWithMoves()
      .filter((gameBoard) => gameBoard[0].getNormalForm() == newNormalForm)!
    const min = Math.min(...options.map((item) => item[0].code))
    const newBoard = options.findIndex((gameBoard) => gameBoard[0].getCode() == min)!
    GameHandler.getInstance().performTurn(options[newBoard][1][0], options[newBoard][1][1])
  }

  /**
   * Choose a suitable next gameboard, by weights.
   * @returns the normal form of the next gameboard
   */
  private pickChildNode(): number {
    const weightedEntries = this.prepareWeightedEntries()
    const randomIndex = this.randomizer.randomInteger(
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

    /*
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
   * Extract the weights of the outgoing edges of a vertex in the weight graph
   * @param normalForm The normal form of the gameboard corresponding to the vertex
   * If no argument is passed, the current configuration of the game is used
   * @returns map of weights
   */
  // private
  getVertexMap(normalForm?: number): Map<NormalForm, number> {
    if (normalForm === undefined) {
      normalForm = GameHandler.getInstance().getGBHandler().getGameBoard().getNormalForm()
    }
    if (!this.weights.has(normalForm) || this.weights.get(normalForm) === undefined) {
      this.initializeWeights(normalForm)
    }
    return this.weights.get(normalForm)!
  }

  /**
   * Initializes the weights of the children of a specified node
   * @todo At the moment, all nodes are always set to 1
   * @param code describes the node where weights are missing
   */
  initializeWeights(code: NormalForm): void {
    const nextNFs: Set<NormalForm> = calculateNextNFs(code)
    const vertexMap = new Map<NormalForm, number>()
    this.weights.set(code, vertexMap)
    for (const nextCode of nextNFs) {
      vertexMap.set(nextCode, this.policy.getInitialWeight(getHeight(code)))
    }
  }

  applyPolicy(): void {
    this.policy.applyPolicy(this, GameHandler.getInstance().getGBHandler().history)
  }

  getName(): string {
    return this.name
  }
}

function getHeight(code: GameBoardCode): number {
  const numberString = code.toString()
  let height = 0
  for (let i = 0; i < numberString.length; i++) {
    if (numberString[i] !== '0') {
      height++
    }
  }
  return height
}
