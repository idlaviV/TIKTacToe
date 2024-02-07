import { GameBoard, getGameBoardFromCode } from './GameBoard'
import type { NormalForm } from './Codes'
import { Graph, TTTNode } from '@/utils/Graph'
import { calculateNextNFs } from './GameBoardHandler'

/**
 * After configuration with GraphBuilder, this graph contains one node for every configuration.
 * Edges connect nodes A and B when a move from one representative of A yields a representative of B.
 */
const bigGraphExport: Graph = new Graph()

const configurationConnections: Map<NormalForm, Set<NormalForm>> = new Map()

/**
 * Returns the normal forms of the configurations which are children of a specific configuration.
 * Already calculated results are stored for later access.
 * @param parent the normal form of the parent configuration
 * @returns A set containing the configurations
 */
export function getPossibleNextNormalForms(parent: NormalForm): Set<NormalForm> {
  if (!(parent in configurationConnections)) {
    configurationConnections.set(parent, calculateNextNFs(parent))
  }
  return configurationConnections.get(parent)!
}

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
    if (!(secondCode in bigGraphExport.nodes)) {
      const newNode = new TTTNode(normalForm, nextBoard.state, this.level + 1)
      bigGraphExport.nodes[normalForm] = newNode
      nextTier.push(nextBoard)
    }
  }

  private registerEdge(normalFormParent: NormalForm, normalFormChild: NormalForm) {
    const firstCode = normalFormParent
    const secondCode = normalFormChild
    const edgeKey: string = firstCode + '#' + secondCode
    bigGraphExport.edges[edgeKey] = {
      source: firstCode.toString(),
      target: secondCode.toString(),
      id: edgeKey,
      height: this.level,
      numSource: firstCode,
      numTarget: secondCode
    }
  }

  private initializeGraph() {
    const root: GameBoard = new GameBoard()
    this.tier = [root]
    this.level = 0
    const normalForm: NormalForm = root.getNormalForm()
    bigGraphExport.nodes[normalForm.toString()] = new TTTNode(normalForm, root.clone(), this.level)
  }
}

export function getBigGraph() {
  return bigGraphExport
}

/**
 * For test purposes only
 */
export function resetBuilder() {
  bigGraphExport.nodes = {}
  bigGraphExport.edges = {}
}
