import type { Edges, Nodes } from 'v-network-graph'
import { GameBoard, getGameBoardFromCode } from './GameBoard'
import { GameHandler } from './GameHandler'
import type { AIPlayer } from './AIPlayer'
import { TTTNode } from '@/utils/GraphExport'
import type { NormalForm } from './Codes'
import type { GameBoardHandler } from './GameBoardHandler'

const nodes: Nodes = {}
const edges: Edges = {}

let tier: GameBoard[]
let level: number

function buildGraph(ai: AIPlayer) {
  initializeGraph()
  while (tier.length !== 0) {
    calculateNextTier(ai)
  }
}

function calculateNextTier(ai: AIPlayer) {
  const nextTier: GameBoard[] = []
  for (const board of tier) {
    const firstCode = board.getNormalForm().toString()
    const map = ai.getVertexMap(board.getNormalForm())
    map.forEach((normalForm: NormalForm) => {
      const nextBoard: GameBoard = getGameBoardFromCode(normalForm)
      const secondCode = normalForm.toString()
      if (secondCode! in nodes) {
        const newNode = new TTTNode(normalForm, nextBoard.state, level + 1)
        nodes[normalForm] = newNode
        nextTier.push(nextBoard)
      }
      const edgeKey: string = firstCode + '#' + secondCode
      edges[edgeKey] = { source: firstCode, target: secondCode }
    })
  }
  tier = nextTier
  level++
}

function initializeGraph() {
  const root: GameBoard = new GameBoard()
  tier = [root]
  level = 0
  const normalForm: NormalForm = root.getNormalForm()
  nodes[normalForm.toString()] = new TTTNode(normalForm, root.clone(), level)
}
