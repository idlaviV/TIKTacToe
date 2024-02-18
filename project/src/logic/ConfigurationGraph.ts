import { GameBoard, getGameBoardFromCode } from './GameBoard'
import type { NormalForm } from './Codes'
import { Graph, TTTEdge, TTTNode } from '@/utils/Graph'
import { getPossibleNextNormalForms } from './GameBoardHandler'
/**
 * @Note This file is not used in the current version of the app.
 */

/**
 * After configuration with GraphBuilder, this graph contains one node for every configuration.
 * Edges connect nodes A and B when a move from one representative of A yields a representative of B.
 */
const configurationGraphExport: Graph = new Graph()

/**
 * A class that constructs the graph of all possible configurations
 */
export class GraphBuilder {
  /**
   * GraphBuilder tracks the GameBoards with a certain height in the configuration graph
   */
  tier: GameBoard[] = []
  level: number = 0

  /**
   * Start the construction of the graph
   */
  buildGraph() {
    this.initializeGraph()
    while (this.tier.length !== 0) {
      this.calculateNextTier()
    }
  }

  private calculateNextTier() {
    const nextTier: GameBoard[] = []
    for (const board of this.tier) {
      const map = getPossibleNextNormalForms(board.getNormalForm())
      map.forEach((_weight, normalFormChild) => {
        this.registerNode(normalFormChild, nextTier)
        this.registerEdge(board.getNormalForm(), normalFormChild)
      })
    }
    this.tier = nextTier
    this.level++
  }

  private registerNode(normalForm: NormalForm, nextTier: GameBoard[]) {
    const nextBoard: GameBoard = getGameBoardFromCode(normalForm)
    const secondCode = normalForm.toString()
    if (!(secondCode in configurationGraphExport.nodes)) {
      const newNode = new TTTNode(normalForm, nextBoard.state, this.level + 1)
      configurationGraphExport.nodes[normalForm] = newNode
      nextTier.push(nextBoard)
    }
  }

  private registerEdge(normalFormParent: NormalForm, normalFormChild: NormalForm) {
    const firstCode = normalFormParent
    const secondCode = normalFormChild
    const edgeKey: string = firstCode + '#' + secondCode
    configurationGraphExport.edges[edgeKey] = new TTTEdge(
      firstCode.toString(),
      secondCode.toString(),
      edgeKey,
      this.level,
      firstCode,
      secondCode
    )
  }

  private initializeGraph() {
    const root: GameBoard = new GameBoard()
    this.tier = [root]
    this.level = 0
    const normalForm: NormalForm = root.getNormalForm()
    configurationGraphExport.nodes[normalForm.toString()] = new TTTNode(
      normalForm,
      root.clone(),
      this.level
    )
  }
}

export function getConfigurationGraphExport() {
  return configurationGraphExport
}

/**
 * For test purposes only
 */
export function resetBuilder() {
  configurationGraphExport.nodes = {}
  configurationGraphExport.edges = {}
}
