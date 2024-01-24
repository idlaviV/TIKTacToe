import type { FieldType } from '@/logic/FieldType'
import { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import { beforeEach, describe, expect, test } from 'vitest'
import { gameBoard1, gameBoard10, gameBoard10000, gameBoard1rot, gameBoard20001 } from './TestUtil'
import type { Edges, Nodes } from 'v-network-graph'
import { graphExport, updateHistory } from '@/utils/GraphExport'

let gameHandler: GameHandler = GameHandler.getInstance()
let nodes: Nodes
let edges: Edges

beforeEach(() => {
  gameHandler.destroySingleton()
  gameHandler = GameHandler.getInstance()
  nodes = graphExport.value.nodes
  edges = graphExport.value.edges
})

describe('constructor', () => {
  test('standard constructor use', () => {
    expect(Object.keys(nodes.value).length).toEqual(4)
    checkNode(nodes.value['0'], '0', new GameBoard().state, 0)
    checkNode(nodes.value['1'], '1', gameBoard1.state, 1)
    checkNode(nodes.value['10'], '10', gameBoard10.state, 1)
    checkNode(nodes.value['10000'], '10000', gameBoard10000.state, 1)
    expect(Object.keys(edges.value).length).toEqual(3)
  })
})

describe('update', () => {
  test('standard first turn', () => {
    gameHandler.gBHandler.gameBoard.value = gameBoard1
    gameHandler.playerOnTurn.value = 2
    updateHistory(gameBoard1)
    expect(Object.keys(nodes.value).length).toEqual(9)
    checkNode(nodes.value['0'], '0', new GameBoard().state, 0)
    checkNode(nodes.value['1'], '1', gameBoard1.state, 1)
    checkNode(nodes.value['10'], '10', gameBoard10.state, 1)
    checkNode(nodes.value['10000'], '10000', gameBoard10000.state, 1)
    checkNode(nodes.value['20001'], '20001', gameBoard20001.state, 2)
    expect(Object.keys(edges.value).length).toEqual(8)
  })
  test('First turn, move is not an equivalence class', () => {
    gameHandler.gBHandler.gameBoard.value = gameBoard1rot
    gameHandler.playerOnTurn.value = 2
    updateHistory(gameBoard1rot)
    console.log(nodes.value)
    expect(Object.keys(nodes.value).length).toEqual(9)
    checkNode(nodes.value['0'], '0', new GameBoard().state, 0)
    /**checkNode(nodes.value["1"], "100", gameBoard1rot.state, 1)
      checkNode(nodes.value["10"], "10", gameBoard10.state, 1)
      checkNode(nodes.value["10000"], "10000", gameBoard10000.state, 1)*/
    checkNode(
      nodes.value['20001'],
      '20100',
      [
        [0, 0, 1],
        [0, 2, 0],
        [0, 0, 0]
      ],
      2
    )
    expect(Object.keys(edges.value).length).toEqual(8)
  })
})

function checkNode(node: any, name: string, boardState: FieldType[][], level: number) {
  expect(node.name).toEqual(name)
  expect(node.boardState).toEqual(boardState)
  expect(node.level).toEqual(level)
}
