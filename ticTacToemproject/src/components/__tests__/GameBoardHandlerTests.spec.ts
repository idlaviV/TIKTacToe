import { GameBoard } from '@/logic/GameBoard'
import { GameBoardHandler } from '@/logic/GameBoardHandler'
import { drawStatus } from '@/logic/WinnerStatus'
import { beforeEach, describe, expect, test } from 'vitest'

let handler: GameBoardHandler
beforeEach(() => {
  handler = new GameBoardHandler()
})

describe('calculation of winner', () => {
  test('player 1 win', () => {
    handler.gameBoard.value = new GameBoard([
      [1, 1, 1],
      [2, 2, 0],
      [0, 0, 0]
    ])
    expect(handler.calculateWinner()).toEqual(1)
  })

  test('player 2 win', () => {
    handler.gameBoard.value = new GameBoard([
      [1, 1, 0],
      [2, 2, 2],
      [0, 0, 1]
    ])
    expect(handler.calculateWinner()).toEqual(2)
  })

  test('draw', () => {
    handler.gameBoard.value = new GameBoard([
      [1, 1, 2],
      [2, 2, 1],
      [1, 2, 1]
    ])
    expect(handler.calculateWinner()).toEqual(drawStatus)
  })

  test('game not over', () => {
    handler.gameBoard.value = new GameBoard([
      [1, 0, 0],
      [0, 2, 0],
      [0, 0, 1]
    ])
    expect(handler.calculateWinner()).toEqual(null)
  })
})
