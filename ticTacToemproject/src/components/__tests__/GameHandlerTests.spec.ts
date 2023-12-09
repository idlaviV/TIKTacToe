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

describe('getWinner', () => {
  test('player 1 win', () => {
    handler.performTurn(0, 0)
    handler.performTurn(1, 0)
    handler.performTurn(0, 1)
    handler.performTurn(1, 1)
    handler.performTurn(0, 2)
    expect(handler.getWinner()).toEqual(1)
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

    test('game not over', () => {
      handler.performTurn(0, 0)
      handler.performTurn(1, 0)
      handler.performTurn(2, 0)
      expect(handler.getWinner()).toEqual(null)
    })
  })
})
