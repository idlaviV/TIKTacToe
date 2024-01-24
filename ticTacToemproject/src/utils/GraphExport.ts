import type { GameBoardCode, NormalForm } from '@/logic/Codes'
import type { FieldType } from '@/logic/FieldType'
import { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import { IsomorphismGroup } from '@/logic/IsomorphismGroup'
import type { ArrayMultimap } from '@teppeis/multimaps'
import { type Edges, type Node, type Nodes } from 'v-network-graph'
import { type Ref, ref } from 'vue'

export class Graph {
  level: number = 0
  currentChildren: TTTNode[] = []
  lastCode: string = 'NotInitialized'
  nodes: Nodes = {}
  edges: Edges = {}
  activeNode: TTTNode | undefined = undefined

  initializeHistory() {
    const gameBoard: GameBoard = GameHandler.getInstance().getGBHandler().getGameBoard()
    const newCode = gameBoard.getCode().toString()
    const newNode: TTTNode = new TTTNode(gameBoard.getCode(), gameBoard.state, this.level)
    this.nodes[newCode] = newNode
    this.activeNode = newNode
    this.lastCode = newCode
    addChildren(this)
    this.level = 1
  }

  /**
   * @returns the code of the active node
   */
  getLastCode(): string {
    /**const lastCode:string = activeNode.value?.name!
  console.log("Last code is "+lastCode)
  return lastCode*/
    return this.lastCode
  }
}
export const graphExport: Ref<Graph> = ref(new Graph())

function addChildren(graph: Graph) {
  const childrenOfActiveGameBoard: GameBoard[] =
    GameHandler.getInstance().getPossibleNextPositions()
  const equivalenceClasses: ArrayMultimap<NormalForm, GameBoard> =
    IsomorphismGroup.getEquivalenceClassesOfGameBoards(childrenOfActiveGameBoard)
  const representatives: Map<NormalForm, GameBoard> =
    IsomorphismGroup.getRepresentativeOfEquivalenceClasses(equivalenceClasses)
  equivalenceClasses.asMap().forEach((value, key) => {
    const representative: GameBoard = representatives.get(key)!
    const newNode: TTTNode = new TTTNode(
      representative.getCode(),
      representative.state,
      graph.level + 1,
      true
    )
    newNode.setAlternative(value.map((element) => element.state))
    graph.nodes[key.toString()] = newNode
    graph.currentChildren.push(newNode)
    const edgeKey: string = graph.getLastCode() + '#' + key.toString()
    graph.edges[edgeKey] = { source: graph.getLastCode(), target: key.toString() }
  })
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

  const key: string = graph.getLastCode() + '#' + newCode
  graph.edges[key] = { source: graph.getLastCode(), target: newCode }

  graph.activeNode = newNode
  graph.lastCode = newCode
  graph.currentChildren = []
  addChildren(graph)
  graph.level++
}

/**
 * Resets the history.
 * The passed gameboard is set as the first game state of the new history.
 * @param gameBoard The first game state of the new history
 */
export function resetHistory() {
  graphExport.value = new Graph()
  graphExport.value.initializeHistory()
}

export class TTTNode implements Node {
  name: string
  code: number
  boardState: FieldType[][]
  isChild: boolean
  level: number
  alternatives: FieldType[][][] = []

  constructor(
    code: GameBoardCode,
    boardState: FieldType[][],
    level: number,
    isChild: boolean = false
  ) {
    this.name = code.toString()
    this.code = code
    this.boardState = boardState
    this.level = level
    this.isChild = isChild
  }

  setAlternative(alternative: FieldType[][][]) {
    this.alternatives = alternative
  }
}

function deleteChild(newCode: string, graph: Graph) {
  const oldEdgeLabel: string = graph.getLastCode() + '#' + newCode
  delete graph.edges[oldEdgeLabel]
  delete graph.nodes[newCode]
}
