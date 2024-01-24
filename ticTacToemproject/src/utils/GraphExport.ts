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

export function initializeHistory(gameBoard: GameBoard) {
  const newCode = gameBoard.getCode().toString()
  const newNode: TTTNode = new TTTNode(newCode, gameBoard.state, level)
  nodes.value[newCode] = newNode
  activeNode.value = newNode
  addChildren()
}

/**
 * @returns the code of the active node
 */
function getLastCode(): string {
  return activeNode.value?.name!
}

function addChildren() {
  const childrenOfActiveGameBoard: GameBoard[] =
    GameHandler.getInstance().getPossibleNextPositions()
  const representativesOfChildren: ArrayMultimap<GameBoardCode,FieldType[][]> =
    IsomorphismGroup.getRepresentativesOfNonequivalentGameBoards(childrenOfActiveGameBoard)
  representativesOfChildren.asMap().forEach((value, key) =>{
    const representative:FieldType[][] = childrenOfActiveGameBoard.find((board) => board.getCode() == key)!.clone()
    const newNode:TTTNode =  new TTTNode(key.toString(), representative, level, true)
    for (const alternative of value) {
      newNode.addAlternative(alternative)
    }
    nodes.value[key.toString()] = newNode
  })
}

/**
 * Adds the new game state to the history. Updates the historyWithChildren.
 * @param gameBoard The new game state
 */
export function updateHistory(gameBoard: GameBoard) {
  const newCode: string = gameBoard.getCode().toString()
  const newNode: TTTNode = new TTTNode(newCode, gameBoard.state, level)
  nodes.value[newCode] = newNode
  activeNode.value = newNode
  const key: string = getLastCode() + '#' + newCode
  edges.value[key] = { source: getLastCode(), target: newCode }
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
  boardState: number[][]
  isChild: boolean
  level: number
  alternatives: FieldType[][][] = []

  constructor(name: string, boardState: number[][], level: number, isChild: boolean = false) {
    this.name = name
    this.boardState = boardState
    this.level = level
    this.isChild = isChild
  }

  addAlternative(alternative: FieldType[][]) {
    this.alternatives.push(alternative)
  }

}
