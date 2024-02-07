import type { NormalForm } from '@/logic/Codes'
import { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import { IsomorphismGroup } from '@/logic/IsomorphismGroup'
import type { ArrayMultimap } from '@teppeis/multimaps'
import { type Ref, ref } from 'vue'
import { layout } from './useGraphLayout'
import { updateLabels } from './LabelExport'
import { Graph, TTTNode } from './Graph'

export class GraphExport extends Graph {
  level: number = 0
  activeNodeCode: string = 'NotInitialized'
}

export const graphExport: Ref<GraphExport> = ref(new GraphExport())

/**
 * Reset the exported graph and initializes it with the current game state.
 */
export function initializeHistory() {
  const graph: GraphExport = graphExport.value
  const gameBoard: GameBoard = GameHandler.getInstance().getGBHandler().getGameBoard()
  const newCode = gameBoard.getCode().toString()
  const newNode: TTTNode = new TTTNode(gameBoard.getCode(), gameBoard.state, graph.level)
  graph.nodes[newCode] = newNode
  graph.activeNodeCode = newCode
  addChildren(graph)
  graph.level = 1
  updateLabels()
  layout(graph.nodes, graph.edges)
}

/**
 * Adds the new game state to the history. Updates the historyWithChildren.
 * @param gameBoard The new game state
 */
export function updateHistory(gameBoard: GameBoard) {
  const graph: GraphExport = graphExport.value
  const newCode: string = gameBoard.getNormalForm().toString()
  deleteChild(newCode, graph)
  const newNode: TTTNode = new TTTNode(gameBoard.getCode(), gameBoard.state, graph.level)
  graph.nodes[newCode] = newNode
  const key: string = graph.activeNodeCode + '#' + newCode
  const height: number = getHeightFromCode(graph.activeNodeCode)
  graph.edges[key] = { source: graph.activeNodeCode, target: newCode, id: key, height: height }
  graph.activeNodeCode = newCode
  addChildren(graph)
  graph.level++
  updateLabels()
  layout(graph.nodes, graph.edges)
}

/**
 * Delete the node and the incoming edge of a child from the graph.
 * @param newCode The identifier of the child
 * @param graph The graph containing the node and the edge
 */
function deleteChild(newCode: string, graph: GraphExport) {
  const oldEdgeLabel: string = graph.activeNodeCode + '#' + newCode
  delete graph.edges[oldEdgeLabel]
  delete graph.nodes[newCode]
}

/**
 * Add nodes and corresponding edges for every possible move to the graph.
 */
function addChildren(graph: GraphExport) {
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
  graph: GraphExport,
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
  const height: number = getHeightFromCode(graph.activeNodeCode)
  graph.edges[edgeKey] = { source: graph.activeNodeCode, target: key.toString(), height: height }
}

export function getActiveNodeCode(): string {
  return graphExport.value.activeNodeCode
}

/**
 * Resets the history.
 * The passed gameboard is set as the first game state of the new history.
 * @param gameBoard The first game state of the new history
 */
export function resetHistory() {
  graphExport.value = new GraphExport()
  initializeHistory()
}
function getHeightFromCode(code: string) {
  let height = 0

  for (let index = 0; index < code.length; index++) {
    if (code[index] !== '0') {
      height += 1
    }
  }

  return height
}
