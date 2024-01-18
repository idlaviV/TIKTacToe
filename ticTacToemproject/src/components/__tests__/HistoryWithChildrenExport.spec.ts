import { GameBoard } from '@/logic/GameBoard'
import { HistoryExport } from '@/utils/HistoryExport'
import { HistoryWithChildrenExport } from '@/utils/HistoryWithChildrenExport'
import { beforeEach, describe, expect, test } from 'vitest'
import { GameHandler } from '@/logic/GameHandler'

let historyExport: HistoryExport
let historyWithChildrenExport: HistoryWithChildrenExport

beforeEach(() => {
  historyExport = GameHandler.getInstance().getHistoryExport()
  historyWithChildrenExport = historyExport.getHistoryWithChildrenExport()
})

describe('constructor', () => {
  test('standard constructor use', () => {
    expect(historyWithChildrenExport.nodes.value).toEqual({
      '0': {
        name: '0',
        boardState: new GameBoard().state,
        active: true
      }
    })
    expect(historyWithChildrenExport.edges.value).toEqual({})
    expect(historyWithChildrenExport.lastCode).toEqual('0')
  })
})

describe('addChildren', () => {
  test('After initialization', () => {
    historyWithChildrenExport.addChildren()
    expect(historyWithChildrenExport.nodes.value).toEqual({
      '0': {
        name: '0',
        boardState: new GameBoard().state,
        active: true
      },
      '1': {
        name: '1',
        boardState: [
          [1, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ],
        active: false,
        isChild: true
      },
      '10': {
        name: '10',
        boardState: [
          [0, 1, 0],
          [0, 0, 0],
          [0, 0, 0]
        ],
        active: false,
        isChild: true
      },
      '10000': {
        name: '10000',
        boardState: [
          [0, 0, 0],
          [0, 1, 0],
          [0, 0, 0]
        ],
        active: false,
        isChild: true
      }
    })
    expect(historyWithChildrenExport.edges.value).toEqual({
      '0#1': { source: '0', target: '1' },
      '0#10': { source: '0', target: '10' },
      '0#10000': { source: '0', target: '10000' }
    })
    expect(historyWithChildrenExport.lastCode).toEqual('0')
  })
})

describe('Reacting on the game', () => {
  test('In mid-game', () => {
    GameHandler.getInstance().performTurn(0, 0)
    GameHandler.getInstance().performTurn(1, 1)
    expect(historyWithChildrenExport.getNodes().value).toEqual({
      '0': {
        name: '0',
        boardState: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ],
        active: false
      },
      '1': {
        name: '1',
        boardState: [
          [1, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ],
        active: false
      },
      '20001': {
        name: '20001',
        boardState: [
          [1, 0, 0],
          [0, 2, 0],
          [0, 0, 0]
        ],
        active: true
      },
      '20011': {
        name: '20011',
        boardState: [
          [1, 1, 0],
          [0, 2, 0],
          [0, 0, 0]
        ],
        active: false,
        isChild: true
      },
      '20101': {
        name: '20101',
        boardState: [
          [1, 0, 1],
          [0, 2, 0],
          [0, 0, 0]
        ],
        active: false,
        isChild: true
      },
      '120001': {
        name: '120001',
        boardState: [
          [1, 0, 0],
          [0, 2, 1],
          [0, 0, 0]
        ],
        active: false,
        isChild: true
      },
      '100020001': {
        name: '100020001',
        boardState: [
          [1, 0, 0],
          [0, 2, 0],
          [0, 0, 1]
        ],
        active: false,
        isChild: true
      }
    })
    console.log(historyWithChildrenExport.getEdges().value)
    expect(historyWithChildrenExport.getEdges().value).toEqual({
      '0#1': { source: '0', target: '1' },
      '1#20001': { source: '1', target: '20001' },
      '20001#20011': { source: '20001', target: '20011' },
      '20001#20101': { source: '20001', target: '20101' },
      '20001#120001': { source: '20001', target: '120001' },
      '20001#100020001': { source: '20001', target: '100020001' }
    })
  })
})
