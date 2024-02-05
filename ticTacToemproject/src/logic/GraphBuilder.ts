import { GameBoard, getGameBoardFromCode } from './GameBoard'
import type { AIPlayer } from './AIPlayer'
import type { NormalForm } from './Codes'
import { Graph, TTTNode } from '@/utils/Graph'


const bigGraph : Graph = new Graph()

export class GraphBuilder {
  tier: GameBoard[] = []
  level: number = 0

  buildGraph(ai: AIPlayer) {
    this.initializeGraph()
    while (this.tier.length !== 0) {
      this.calculateNextTier(ai)
    }    
  }

  registerNode(normalForm : NormalForm, nextTier : GameBoard[]) {
    const nextBoard: GameBoard = getGameBoardFromCode(normalForm)
    const secondCode = normalForm.toString()
    if (!(secondCode in bigGraph.nodes)) {
      const newNode = new TTTNode(normalForm, nextBoard.state, this.level + 1)
      bigGraph.nodes[normalForm] = newNode
      nextTier.push(nextBoard)
    }
  }

  calculateNextTier(ai: AIPlayer) {
    const nextTier: GameBoard[] = []
    for (const board of this.tier) {
      const map = ai.getVertexMap(board.getNormalForm())
      map.forEach((_weight, normalFormChild) => {
        this.registerNode(normalFormChild, nextTier)
        this.registerEdge(board.getNormalForm(), normalFormChild) 
      })
    }
    this.tier = nextTier
    this.level++
  }

  registerEdge(normalFormParent: NormalForm, normalFormChild: NormalForm) {
    const firstCode = normalFormParent.toString()
    const secondCode = normalFormChild.toString()
    const edgeKey: string = firstCode + '#' + secondCode
    bigGraph.edges[edgeKey] = { source: firstCode, target: secondCode }
  }

  initializeGraph() {
    const root: GameBoard = new GameBoard()
    this.tier = [root]
    this.level = 0
    const normalForm: NormalForm = root.getNormalForm()
    bigGraph.nodes[normalForm.toString()] = new TTTNode(normalForm, root.clone(), this.level)
  }
}

export function getBigGraph() {
  return bigGraph
}

export function resetBuilder() {
  bigGraph.nodes = {}
  bigGraph.edges = {} 
}
