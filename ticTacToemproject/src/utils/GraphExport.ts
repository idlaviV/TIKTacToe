import type { GameBoardCode, NormalForm } from '@/logic/Codes'
import type { FieldType } from '@/logic/FieldType'
import { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import { IsomorphismGroup } from '@/logic/IsomorphismGroup'
import type { ArrayMultimap } from '@teppeis/multimaps'
import { type Edges, type Node, type Nodes } from 'v-network-graph'
import { type Ref, ref } from 'vue'
import { layout } from './useGraphLayout'
import { updateLabels } from './LabelExport'

export class Graph {
  level: number = 0
  activeNodeCode: number = -1
  nodes: TTTNodes = {}
  edges: Edges = {}
}
export const graphExport: Ref<Graph> = ref(new Graph())
export function getActiveNodeCode(): string {
  return graphExport.value.activeNodeCode.toString()
}
/**
 * Reset the exported graph and initializes it with the current game state.
 */
export function initializeHistory() {
  const graph: Graph = graphExport.value
  const gameBoard: GameBoard = GameHandler.getInstance().getGBHandler().getGameBoard()
  const newCode: number = gameBoard.getCode()
  const newNode: TTTNode = new TTTNode(gameBoard.getCode(), gameBoard.state, graph.level)
  graph.nodes[newCode.toString()] = newNode
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
  const graph: Graph = graphExport.value
  const newCode: number = gameBoard.getNormalForm()
  const newCodeString: string = newCode.toString()
  deleteChild(newCodeString, graph)
  const newNode: TTTNode = new TTTNode(gameBoard.getCode(), gameBoard.state, graph.level)
  graph.nodes[newCode.toString()] = newNode
  const key: string = graph.activeNodeCode + '#' + newCode
  const height: number = getHeightFromCode(graph.activeNodeCode)
  graph.edges[key] = {
    source: graph.activeNodeCode.toString(),
    target: newCodeString,
    id: key,
    height: height,
    numSource: graph.activeNodeCode,
    numTarget: newCode
  }
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
    addChildToGraph(graph, representative, value, key)
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
  key: number
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
  graph.edges[edgeKey] = {
    source: graph.activeNodeCode.toString(),
    target: key.toString(),
    height: height,
    id: edgeKey,
    numSource: graph.activeNodeCode,
    numTarget: key
  }
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

export type TTTNodes = Nodes & { [key: string]: TTTNode }
/**
 * This class is a model for the visualization of a game configuration in the graph.
 */
export class TTTNode implements Node {
  // A string representation of the code of the gameboard that is visualized by this node.
  name: string
  // The code of the gameboard that is visualized by this node.
  code: GameBoardCode
  // The state of the gameboard that is visualized by this node.
  boardState: FieldType[][]
  // Whether this node is just an intermediate leaf in the graph.
  isChild: boolean
  // The level of the node in the graph. The root element has level 0.
  level: number
  // All alternative gameboards that could be played, equivalent to the gameboard that is visualized by this node.
  alternatives: FieldType[][][] = []

  constructor(
    code: GameBoardCode,
    boardState: FieldType[][],
    level: number,
    isChild: boolean = false,
    alternatives: FieldType[][][] = []
  ) {
    this.name = code.toString()
    this.code = code
    this.boardState = boardState
    this.level = level
    this.isChild = isChild
    this.alternatives = alternatives
  }
}

function getHeightFromCode(code: number) {
  const codeString = code.toString()
  let height = 0

  for (let index = 0; index < codeString.length; index++) {
    if (codeString[index] !== '0') {
      height += 1
    }
  }

  return height
}
