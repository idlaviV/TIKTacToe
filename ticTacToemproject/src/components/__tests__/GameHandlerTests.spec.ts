import { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import { drawStatus } from '@/logic/WinnerStatus'
import { beforeEach, describe, expect, test } from 'vitest'

let handler: GameHandler = new GameHandler()

beforeEach(() => {
  handler = new GameHandler()
})

describe('resetGame', () => {
  test('reset', () => {
    handler.performTurn(0, 0)
    handler.resetGame()
    expect(handler.winner).toEqual(null)
    expect(handler.getPlayerOnTurn()).toEqual(1)
  })
})

describe('calculation of winner', () => {
  test('player 1 win', () => {
    handler.performTurn(0, 0)
    handler.performTurn(1, 0)
    handler.performTurn(0, 1)
    handler.performTurn(1, 1)
    handler.performTurn(0, 2)
    expect(handler.getWinner()).toEqual(1)
    handler.performTurn(2, 2)
    expect(handler.gBHandler.gameBoard.state[2][2]).toEqual(0)
  })

  test('player 2 win', () => {
    handler.performTurn(0, 0)
    handler.performTurn(1, 0)
    handler.performTurn(0, 1)
    handler.performTurn(1, 1)
    handler.performTurn(2, 2)
    handler.performTurn(1, 2)
    expect(handler.getWinner()).toEqual(2)
  })

  test('draw', () => {
    handler.performTurn(0, 0)
    handler.performTurn(1, 0)
    handler.performTurn(2, 0)
    handler.performTurn(1, 1)
    handler.performTurn(0, 1)
    handler.performTurn(0, 2)
    handler.performTurn(1, 2)
    handler.performTurn(2, 1)
    handler.performTurn(2, 2)
    expect(handler.getWinner()).toEqual(drawStatus)
  })

  test('game not over', () => {
    handler.performTurn(0, 0)
    handler.performTurn(1, 0)
    handler.performTurn(2, 0)
    expect(handler.getWinner()).toEqual(null)
  })
})

describe('nextTurns', () => {
  let nextTurns: (readonly [GameBoard, [number, number]])[] = []
  test('first turn', () => {
    nextTurns = handler.getPossibleNextPositionsWithMoves()
    expect(nextTurns.length).toEqual(9)
    expect(nextTurns[0][0].state).toEqual([
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ])
    expect(nextTurns[0][1]).toEqual([0, 0])
    expect(nextTurns[1][0].state).toEqual([
      [0, 1, 0],
      [0, 0, 0],
      [0, 0, 0]
    ])
    expect(nextTurns[1][1]).toEqual([0, 1])
    expect(nextTurns[2][0].state).toEqual([
      [0, 0, 1],
      [0, 0, 0],
      [0, 0, 0]
    ])
    expect(nextTurns[2][1]).toEqual([0, 2])
    expect(nextTurns[3][0].state).toEqual([
      [0, 0, 0],
      [1, 0, 0],
      [0, 0, 0]
    ])
    expect(nextTurns[3][1]).toEqual([1, 0])
    expect(nextTurns[4][0].state).toEqual([
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0]
    ])
    expect(nextTurns[4][1]).toEqual([1, 1])
    expect(nextTurns[5][0].state).toEqual([
      [0, 0, 0],
      [0, 0, 1],
      [0, 0, 0]
    ])
    expect(nextTurns[5][1]).toEqual([1, 2])
    expect(nextTurns[6][0].state).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [1, 0, 0]
    ])
    expect(nextTurns[6][1]).toEqual([2, 0])
    expect(nextTurns[7][0].state).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 1, 0]
    ])
    expect(nextTurns[7][1]).toEqual([2, 1])
    expect(nextTurns[8][0].state).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 1]
    ])
    expect(nextTurns[8][1]).toEqual([2, 2])
  })

  test('later turn', () => {
    handler.performTurn(0, 0)
    handler.performTurn(1, 0)
    handler.performTurn(0, 1)
    handler.performTurn(1, 1)
    nextTurns = handler.getPossibleNextPositionsWithMoves()
    expect(nextTurns.length).toEqual(5)
    expect(nextTurns[0][0].state).toEqual([
      [1, 1, 1],
      [2, 2, 0],
      [0, 0, 0]
    ])
    expect(nextTurns[0][1]).toEqual([0, 2])
    expect(nextTurns[1][0].state).toEqual([
      [1, 1, 0],
      [2, 2, 1],
      [0, 0, 0]
    ])
    expect(nextTurns[1][1]).toEqual([1, 2])
    expect(nextTurns[2][0].state).toEqual([
      [1, 1, 0],
      [2, 2, 0],
      [1, 0, 0]
    ])
    expect(nextTurns[2][1]).toEqual([2, 0])
    expect(nextTurns[3][0].state).toEqual([
      [1, 1, 0],
      [2, 2, 0],
      [0, 1, 0]
    ])
    expect(nextTurns[3][1]).toEqual([2, 1])
    expect(nextTurns[4][0].state).toEqual([
      [1, 1, 0],
      [2, 2, 0],
      [0, 0, 1]
    ])
    expect(nextTurns[4][1]).toEqual([2, 2])
  })

  test('player won', () => {
    handler.performTurn(0, 0)
    handler.performTurn(1, 0)
    handler.performTurn(0, 1)
    handler.performTurn(1, 1)
    handler.performTurn(0, 2)
    nextTurns = handler.getPossibleNextPositionsWithMoves()
    expect(nextTurns.length).toEqual(0)
  })

  test('draw', () => {
    handler.performTurn(0, 0)
    handler.performTurn(1, 0)
    handler.performTurn(2, 0)
    handler.performTurn(1, 1)
    handler.performTurn(0, 1)
    handler.performTurn(0, 2)
    handler.performTurn(1, 2)
    handler.performTurn(2, 1)
    handler.performTurn(2, 2)
    nextTurns = handler.getPossibleNextPositionsWithMoves()
    expect(nextTurns.length).toEqual(0)
  })
})
