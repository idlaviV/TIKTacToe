import type { GameBoardCode } from '@/logic/Codes'
import type { FieldType } from '@/logic/FieldType'
import type { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import { IsomorphismGroup } from '@/logic/IsomorphismGroup'
import type { ArrayMultimap } from '@teppeis/multimaps'
import { type Edges, type Node, type Nodes } from 'v-network-graph'
import { type Ref, ref } from 'vue'

export const nodes: Ref<Nodes> = ref({})
export const edges: Ref<Edges> = ref({})
export const activeNode: Ref<TTTNode | undefined> = ref()
let level: number = 0
let currentChildren : TTTNode[] = []

export function initializeHistory(gameBoard: GameBoard) {
  const newCode = gameBoard.getCode().toString()
  const newNode: TTTNode = new TTTNode(gameBoard.getCode(), gameBoard.state, level)
  nodes.value[newCode] = newNode
  activeNode.value = newNode
  addChildren()
}

/**
 * @returns the code of the active node
 */
function getLastCode(): string {
  const lastCode:string = activeNode.value?.name!
  console.log("Last code is "+lastCode)
  return lastCode
}

function addChildren() {
  const childrenOfActiveGameBoard: GameBoard[] =
    GameHandler.getInstance().getPossibleNextPositions()
  const representativesOfChildren: ArrayMultimap<GameBoardCode,FieldType[][]> =
    IsomorphismGroup.getRepresentativesOfNonequivalentGameBoards(childrenOfActiveGameBoard)
  representativesOfChildren.asMap().forEach((value, key) =>{
    const representative:FieldType[][] = childrenOfActiveGameBoard.find((board) => board.getCode() == key)!.clone()
    const newNode:TTTNode =  new TTTNode(key, representative, level+1, true)
    for (const alternative of value) {
      newNode.addAlternative(alternative)
    }
    nodes.value[key.toString()] = newNode
    currentChildren.push(newNode)
    const edgeKey:string = getLastCode() + '#' + key.toString()
    edges.value[edgeKey] = {source: getLastCode(), target: key.toString()}
  })
}

/**
 * Adds the new game state to the history. Updates the historyWithChildren.
 * @param gameBoard The new game state
 */
export function updateHistory(gameBoard: GameBoard) {
  deleteChild(gameBoard)
  const newCode: string = gameBoard.getCode().toString()
  const newNode: TTTNode = new TTTNode(gameBoard.getCode(), gameBoard.state, level)
  nodes.value[newCode] = newNode

  const key: string = getLastCode() + '#' + newCode
  edges.value[key] = { source: getLastCode(), target: newCode }
  
  activeNode.value = newNode
  currentChildren = []
  addChildren()
  level++
}

/**
 * Resets the history.
 * The passed gameboard is set as the first game state of the new history.
 * @param gameBoard The first game state of the new history
 */
export function resetHistory(gameBoard: GameBoard) {
  Object.keys(nodes.value).forEach((element) => {
    delete nodes.value[element]
  })
  Object.keys(edges.value).forEach((element) => {
    delete edges.value[element]
  })
  initializeHistory(gameBoard)
}

export class TTTNode implements Node {
  name: string
  code: number
  boardState: FieldType[][]
  isChild: boolean
  level: number
  alternatives: FieldType[][][] = []

  constructor(code: GameBoardCode, boardState: FieldType[][], level: number, isChild: boolean = false) {
    this.name = code.toString()
    this.code = code
    this.boardState = boardState
    this.level = level
    this.isChild = isChild
  }

  addAlternative(alternative: FieldType[][]) {
    this.alternatives.push(alternative)
  }

}
function deleteChild(gameBoard: GameBoard) {
  for (const child of currentChildren) {
    if (IsomorphismGroup.getGameBoardEquiv(gameBoard).has(child.code))
    {
      const oldEdgeLabel:string = activeNode.value?.code + "#" + child.name
      delete edges.value[oldEdgeLabel]
      delete nodes.value[child.name]
    }
  }
}

