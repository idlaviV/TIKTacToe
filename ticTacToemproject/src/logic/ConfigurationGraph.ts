import { GameBoard, getGameBoardFromCode } from './GameBoard'
import type { NormalForm } from './Codes'
import { Graph, TTTNode } from '@/utils/Graph'
import { calculateNextNFs } from './GameBoardHandler'
import { ref, type Ref } from 'vue'
import type { Layouts } from 'v-network-graph'

/**
 * After configuration with GraphBuilder, this graph contains one node for every configuration.
 * Edges connect nodes A and B when a move from one representative of A yields a representative of B.
 */
const bigGraphExport: Ref<Graph> = ref(new Graph())
export const testLayout :Layouts = {nodes: {}}
let layoutCounter = 0

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
    while (this.tier.length !== 0 && this.level < 4) {
      this.calculateNextTier()
    }
    console.log("done with graph construction")
    console.log(testLayout.nodes)
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
    if (!(secondCode in bigGraphExport.value.nodes)) {
      const newNode = new TTTNode(normalForm, nextBoard.state, this.level + 1)
      bigGraphExport.value.nodes[normalForm] = newNode
      nextTier.push(nextBoard)
      testLayout.nodes[secondCode] = {x:layoutCounter*40, y:layoutCounter*40}
      layoutCounter++
    }
  }

  private registerEdge(normalFormParent: NormalForm, normalFormChild: NormalForm) {
    const firstCode = normalFormParent.toString()
    const secondCode = normalFormChild.toString()
    const edgeKey: string = firstCode + '#' + secondCode
    bigGraphExport.value.edges[edgeKey] = { source: firstCode, target: secondCode }
  }

  private initializeGraph() {
    const root: GameBoard = new GameBoard()
    this.tier = [root]
    this.level = 0
    const normalForm: NormalForm = root.getNormalForm()
    bigGraphExport.value.nodes[normalForm.toString()] = new TTTNode(normalForm, root.clone(), this.level)
    testLayout.nodes["0"] = {x:-1, y:-1}
  }
}

export function getBigGraph() {
  return bigGraphExport
}

/**
 * For test purposes only
 */
export function resetBuilder() {
  bigGraphExport.value.nodes = {}
  bigGraphExport.value.edges = {}
}
