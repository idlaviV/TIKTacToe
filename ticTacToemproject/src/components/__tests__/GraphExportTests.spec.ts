import type { FieldType } from '@/logic/FieldType'
import { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import {
  gameBoard1,
  gameBoard10,
  gameBoard10000,
  gameBoard1rot,
  gameBoard20001,
  gameBoard21
} from './TestUtil'
import type { Edges, Nodes } from 'v-network-graph'
import {
  Graph,
  graphExport,
  initializeHistory,
  resetHistory,
  updateHistory
} from '@/utils/GraphExport'

vi.mock('@/utils/LabelExport', () => {
  return {
    updateLabels: vi.fn()
  }
})

let gameHandler: GameHandler = GameHandler.getInstance()
let nodes: Nodes
let edges: Edges

beforeEach(() => {
  gameHandler.destroySingleton()
  gameHandler = GameHandler.getInstance()
  initHistory()
})

describe('constructor', () => {
  test('standard constructor use', () => {
    expect(Object.keys(nodes).length).toEqual(4)
    checkNode(nodes['0'], '0', new GameBoard().state, 0)
    checkNode(nodes['1'], '1', gameBoard1.state, 1)
    checkNode(nodes['10'], '10', gameBoard10.state, 1)
    checkNode(nodes['10000'], '10000', gameBoard10000.state, 1)
    expect(Object.keys(edges).length).toEqual(3)
  })
  test('uncommon constructor use', () => {
    gameHandler.gBHandler.gameBoard.value = gameBoard21
    initHistory()
    expect(Object.keys(nodes).length).toEqual(8)
    checkNode(nodes['21'], '21', gameBoard21.state, 0)
    checkNode(
      nodes['121'],
      '121',
      [
        [1, 2, 1],
        [0, 0, 0],
        [0, 0, 0]
      ],
      1
    )
  })
})

describe('update', () => {
  test('standard first turn', () => {
    gameHandler.gBHandler.gameBoard.value = gameBoard1
    gameHandler.playerOnTurn.value = 2
    updateHistory(gameBoard1)
    expect(Object.keys(nodes).length).toEqual(9)
    checkNode(nodes['0'], '0', new GameBoard().state, 0)
    checkNode(nodes['1'], '1', gameBoard1.state, 1)
    checkNode(nodes['10'], '10', gameBoard10.state, 1)
    checkNode(nodes['10000'], '10000', gameBoard10000.state, 1)
    checkNode(nodes['20001'], '20001', gameBoard20001.state, 2)
    expect(Object.keys(edges).length).toEqual(8)
  })
  test('First turn, move is not an equivalence class', () => {
    gameHandler.gBHandler.gameBoard.value = gameBoard1rot
    gameHandler.playerOnTurn.value = 2
    updateHistory(gameBoard1rot)
    expect(Object.keys(nodes).length).toEqual(9)
    checkNode(nodes['0'], '0', new GameBoard().state, 0)
    checkNode(nodes['1'], '100', gameBoard1rot.state, 1)
    checkNode(nodes['10'], '10', gameBoard10.state, 1)
    checkNode(nodes['10000'], '10000', gameBoard10000.state, 1)
    checkNode(
      nodes['20001'],
      '20100',
      [
        [0, 0, 1],
        [0, 2, 0],
        [0, 0, 0]
      ],
      2
    )
    expect(Object.keys(edges).length).toEqual(8)
  })
})

describe('reset history', () => {
  test('reset', () => {
    updateHistory(gameBoard1)
    updateHistory(gameBoard10)
    resetHistory()
    expect(Object.keys(graphExport.value.nodes).length).toEqual(4)
    checkNode(nodes['0'], '0', new GameBoard().state, 0)
    expect(Object.keys(graphExport.value.edges).length).toEqual(3)
  })
})

function initHistory() {
  graphExport.value = new Graph()
  initializeHistory()
  nodes = graphExport.value.nodes
  edges = graphExport.value.edges
}

function checkNode(node: any, name: string, boardState: FieldType[][], level: number) {
  expect(node.name).toEqual(name)
  expect(node.boardState).toEqual(boardState)
  expect(node.level).toEqual(level)
}
