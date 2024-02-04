import type { Edges, Nodes } from 'v-network-graph'
import { GameBoard, getGameBoardFromCode } from './GameBoard'
import type { AIPlayer } from './AIPlayer'
import { TTTNode, type TTTNodes } from '@/utils/GraphExport'
import type { NormalForm } from './Codes'

class GraphBuilder {
  nodes: TTTNodes = {}
  edges: Edges = {}
}

let builder : GraphBuilder = new GraphBuilder
let tier: GameBoard[] = []
let level: number = 0

export function buildGraph(ai: AIPlayer) {
  initializeGraph()
  while (tier.length !== 0) {
    calculateNextTier(ai)
  }
}

function registerNode(normalForm : NormalForm, nextTier : GameBoard[]) {
  const nextBoard: GameBoard = getGameBoardFromCode(normalForm)
  const secondCode = normalForm.toString()
  if (!(secondCode in builder.nodes)) {
    const newNode = new TTTNode(normalForm, nextBoard.state, level + 1)
    builder.nodes[normalForm] = newNode
    nextTier.push(nextBoard)
  }
}

function calculateNextTier(ai: AIPlayer) {
  const nextTier: GameBoard[] = []
  for (const board of tier) {
    const map = ai.getVertexMap(board.getNormalForm())
    map.forEach((_weight, normalFormChild) => {
      registerNode(normalFormChild, nextTier)
      registerEdge(board.getNormalForm(), normalFormChild) 
    })
  }
  tier = nextTier
  level++
}

function registerEdge(normalFormParent: NormalForm, normalFormChild: NormalForm) {
  const firstCode = normalFormParent.toString()
  const secondCode = normalFormChild.toString()
  const edgeKey: string = firstCode + '#' + secondCode
  builder.edges[edgeKey] = { source: firstCode, target: secondCode }
}

function initializeGraph() {
  const root: GameBoard = new GameBoard()
  tier = [root]
  level = 0
  const normalForm: NormalForm = root.getNormalForm()
  builder.nodes[normalForm.toString()] = new TTTNode(normalForm, root.clone(), level)
}

export function getNodes() {
  return builder.nodes
}

export function getEdges() {
  return builder.edges
}

export function getGraph() {
  return builder
}

export function resetBuilder() {
  builder = new GraphBuilder()
}
