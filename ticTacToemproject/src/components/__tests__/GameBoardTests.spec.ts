import { GameBoardHandler } from '../../logic/GameBoardHandler'
import { GameBoard } from '../../logic/GameBoard'
import { describe, expect, test, beforeEach } from 'vitest'

let handler: GameBoardHandler

describe('move', () => {
  beforeEach(() => {
    handler = new GameBoardHandler()
  })

  test('add piece to board legally', () => {
    handler.move(0, 0, 1)
    expect(handler.getGameBoard()).toEqual(
      new GameBoard([
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(handler.history.length == 2)
  })

  test('add piece to board illegally', () => {
    handler.move(0, 0, 1)
    expect(() => handler.move(0, 0, 2)).toThrowError('This piece cannot go there')
    expect(handler.history.length == 1)
  })

  test('add piece to board legally, old gameboard should not change', () => {
    const oldBoard = handler.getGameBoard()
    handler.move(1, 1, 2)
    expect(oldBoard).toEqual(
      new GameBoard([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
  })
})
