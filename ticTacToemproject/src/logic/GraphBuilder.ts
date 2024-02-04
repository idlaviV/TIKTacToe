import type { Edges, Nodes } from 'v-network-graph'
import { GameBoard, getGameBoardFromCode } from './GameBoard'
import type { AIPlayer } from './AIPlayer'
import { TTTNode } from '@/utils/GraphExport'
import type { NormalForm } from './Codes'

class GraphBuilder {
  nodes: Nodes = {}
  edges: Edges = {}
  tier: GameBoard[] = []
  level: number = 0
}

let builder : GraphBuilder = new GraphBuilder


export function buildGraph(ai: AIPlayer) {
  initializeGraph()
  console.log("Initialize happened")
  console.log(builder.nodes)
  while (builder.tier.length !== 0 && builder.level < 2) {
    calculateNextTier(ai)
  }
}

function calculateNextTier(ai: AIPlayer) {
  const nextTier: GameBoard[] = []
  for (const board of builder.tier) {
    const firstCode = board.getNormalForm().toString()
    const map = ai.getVertexMap(board.getNormalForm())
    map.forEach((weight, normalForm) => {
      const nextBoard: GameBoard = getGameBoardFromCode(normalForm)
      const secondCode = normalForm.toString()
      if (!(secondCode in builder.nodes)) {
        const newNode = new TTTNode(normalForm, nextBoard.state, builder.level + 1)
        builder.nodes[normalForm] = newNode
        nextTier.push(nextBoard)
      }
      const edgeKey: string = firstCode + '#' + secondCode
      builder.edges[edgeKey] = { source: firstCode, target: secondCode }
    })
  }
  builder.tier = nextTier
  builder.level++
}

function initializeGraph() {
  const root: GameBoard = new GameBoard()
  builder.tier = [root]
  builder.level = 0
  const normalForm: NormalForm = root.getNormalForm()
  builder.nodes[normalForm.toString()] = new TTTNode(normalForm, root.clone(), builder.level)
}

export function getNodes() {
  return builder.nodes
}

export function getEdges() {
  return builder.edges
}

export function resetBuilder() {
  builder = new GraphBuilder()
}
