import { GameBoard } from '@/logic/GameBoard'
import { HistoryExport } from '@/utils/HistoryExport'
import { beforeEach, describe, expect, test } from 'vitest'

let historyExport: HistoryExport

beforeEach(() => {
  historyExport = new HistoryExport(new GameBoard())
})

describe('constructor', () => {
  test('standard constructor use', () => {
    expect(historyExport.nodes).toEqual({
      '0': {
        name: '0',
        boardState: new GameBoard().state,
        active: true
      }
    })
    expect(historyExport.edges).toEqual({})
    expect(historyExport.lastCode).toEqual('0')
  })

  test('uncommon constructor use', () => {
    historyExport = new HistoryExport(
      new GameBoard([
        [1, 2, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(historyExport.nodes).toEqual({
      '21': {
        name: '21',
        boardState: [
          [1, 2, 0],
          [0, 0, 0],
          [0, 0, 0]
        ],
        active: true
      }
    })
    expect(historyExport.edges).toEqual({})
    expect(historyExport.lastCode).toEqual('21')
  })
})

describe('updateHistory', () => {
  test('update once', () => {
    historyExport.updateHistory(
      new GameBoard([
        [1, 2, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(historyExport.nodes).toEqual({
      '21': {
        name: '21',
        boardState: [
          [1, 2, 0],
          [0, 0, 0],
          [0, 0, 0]
        ],
        active: true
      },
      '0': {
        name: '0',
        boardState: new GameBoard().state,
        active: false
      }
    })
    expect(historyExport.edges).toEqual({
      '0#21': {
        source: '0',
        target: '21'
      }
    })
    expect(historyExport.lastCode).toEqual('21')
  })

  test('update multiple times', () => {
    historyExport.updateHistory(
      new GameBoard([
        [1, 2, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    historyExport.updateHistory(
      new GameBoard([
        [0, 1, 2],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(historyExport.nodes).toEqual({
      '21': {
        name: '21',
        boardState: [
          [1, 2, 0],
          [0, 0, 0],
          [0, 0, 0]
        ],
        active: false
      },
      '0': {
        name: '0',
        boardState: new GameBoard().state,
        active: false
      },
      '210': {
        name: '210',
        boardState: [
          [0, 1, 2],
          [0, 0, 0],
          [0, 0, 0]
        ],
        active: true
      }
    })
    expect(historyExport.edges).toEqual({
      '0#21': {
        source: '0',
        target: '21'
      },
      '21#210': {
        source: '21',
        target: '210'
      }
    })
    expect(historyExport.lastCode).toEqual('210')
  })
})

describe('resetHistory', () => {
  test('reset', () => {
    historyExport.updateHistory(
      new GameBoard([
        [1, 2, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    historyExport.resetHistory(new GameBoard())
    expect(historyExport.nodes).toEqual({
      '0': {
        name: '0',
        boardState: new GameBoard().state,
        active: true
      }
    })
    expect(historyExport.edges).toEqual({})
    expect(historyExport.lastCode).toEqual('0')
  })
})
