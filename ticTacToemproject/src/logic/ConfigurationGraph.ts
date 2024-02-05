import { GameBoard, getGameBoardFromCode } from './GameBoard'
import type { NormalForm } from './Codes'
import { Graph, TTTNode } from '@/utils/Graph'
import { calculateNextNFs } from './GameBoardHandler'
import type { Layouts } from 'v-network-graph'
import { ref, type Ref } from 'vue'
import dagre from '@dagrejs/dagre'
import * as gc from '@/components/GraphConstants'



/**
 * After configuration with GraphBuilder, this graph contains one node for every configuration.
 * Edges connect nodes A and B when a move from one representative of A yields a representative of B.
 */
const bigGraphExport: Graph = new Graph()
export const bigLayout : Ref<Layouts> = ref({nodes:{}})

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
    console.log("done with graph construction")
    layoutBigGraph()
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
    const firstCode = normalFormParent.toString()
    const secondCode = normalFormChild.toString()
    const edgeKey: string = firstCode + '#' + secondCode
    bigGraphExport.edges[edgeKey] = { source: firstCode, target: secondCode }
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
function layoutBigGraph() {
  const g = new dagre.graphlib.Graph()
  g.setGraph({
    rankdir: 'TB',
    nodesep: gc.nodesep,
    edgesep: gc.edgesep,
    ranksep: gc.ranksep
  })
  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(() => ({}))

  // Add nodes to the graph. The first argument is the node id. The second is
  // metadata about the node. In this case we're going to add labels to each of
  // our nodes.
  Object.entries(bigGraphExport.nodes).forEach(([nodeId, node]) => {
    g.setNode(nodeId, { label: node.name, width: gc.nodeSize, height: gc.nodeSize })
  })

  // Add edges to the graph.
  Object.values(bigGraphExport.edges).forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  dagre.layout(g)

  g.nodes().forEach((nodeId: string) => {
    const x = g.node(nodeId).x 
    const y = g.node(nodeId).y 
    bigLayout.value.nodes[nodeId] = { x,y }
  })

}

