import type { NormalForm } from '@/logic/Codes'
import { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import { IsomorphismGroup } from '@/logic/IsomorphismGroup'
import type { ArrayMultimap } from '@teppeis/multimaps'
import { type Edges } from 'v-network-graph'
import { type Ref, ref } from 'vue'
import { layout } from './useGraphLayout'
import { type TTTNodes, TTTNode } from './TTTNodes'

export class Graph {
  level: number = 0
  activeNodeCode: string = 'NotInitialized'
  nodes: TTTNodes = {}
  edges: Edges = {}
}
export const graphExport: Ref<Graph> = ref(new Graph())
export function getActiveNodeCode(): string {
  return graphExport.value.activeNodeCode
}
/**
 * Reset the exported graph and initializes it with the current game state.
 */
export function initializeHistory() {
  const graph: Graph = graphExport.value
  const gameBoard: GameBoard = GameHandler.getInstance().getGBHandler().getGameBoard()
  const newCode = gameBoard.getCode().toString()
  const newNode: TTTNode = new TTTNode(gameBoard.getCode(), gameBoard.state, graph.level)
  graph.nodes[newCode] = newNode
  graph.activeNodeCode = newCode
  addChildren(graph)
  graph.level = 1
  layout(graph.nodes, graph.edges)
}

/**
 * Adds the new game state to the history. Updates the historyWithChildren.
 * @param gameBoard The new game state
 */
export function updateHistory(gameBoard: GameBoard) {
  const graph: Graph = graphExport.value
  const newCode: string = gameBoard.getNormalForm().toString()
  deleteChild(newCode, graph)
  const newNode: TTTNode = new TTTNode(gameBoard.getCode(), gameBoard.state, graph.level)
  graph.nodes[newCode] = newNode
  const key: string = graph.activeNodeCode + '#' + newCode
  graph.edges[key] = { source: graph.activeNodeCode, target: newCode }
  graph.activeNodeCode = newCode
  addChildren(graph)
  graph.level++
  layout(graph.nodes, graph.edges)
}

/**
 * Delete the node and the incoming edge of a child from the graph.
 * @param newCode The identifier of the child
 * @param graph The graph containing the node and the edge
 */
function deleteChild(newCode: string, graph: Graph) {
  const oldEdgeLabel: string = graph.activeNodeCode + '#' + newCode
  delete graph.edges[oldEdgeLabel]
  delete graph.nodes[newCode]
}

/**
 * Add nodes and corresponding edges for every possible move to the graph.
 */
function addChildren(graph: Graph) {
  const childrenOfActiveGameBoard: GameBoard[] =
    GameHandler.getInstance().getPossibleNextPositions()
  const equivalenceClasses: ArrayMultimap<NormalForm, GameBoard> =
    IsomorphismGroup.getEquivalenceClassesOfGameBoards(childrenOfActiveGameBoard)
  const representatives: Map<NormalForm, GameBoard> =
    IsomorphismGroup.getRepresentativeOfEquivalenceClasses(equivalenceClasses)
  equivalenceClasses.asMap().forEach((value, key) => {
    const representative: GameBoard = representatives.get(key)!
    addChildToGraph(graph, representative, value, key.toString())
  })
}

/**
 * Add a child and corresponding edge to the graph.
 * @param representative The gameboard representing the equivalence class
 * @param alternatives All gameboards in the equivalence class
 * @param key The normal form of the equivalence class
 */
function addChildToGraph(
  graph: Graph,
  representative: GameBoard,
  alternatives: GameBoard[],
  key: string
) {
  const newNode: TTTNode = new TTTNode(
    representative.getCode(),
    representative.state,
    graph.level + 1,
    true,
    alternatives.map((element) => element.state)
  )
  graph.nodes[key.toString()] = newNode
  const edgeKey: string = graph.activeNodeCode + '#' + key.toString()
  graph.edges[edgeKey] = { source: graph.activeNodeCode, target: key.toString() }
}

/**
 * Resets the history.
 * The passed gameboard is set as the first game state of the new history.
 * @param gameBoard The first game state of the new history
 */
export function resetHistory() {
  graphExport.value = new Graph()
  initializeHistory()
}

