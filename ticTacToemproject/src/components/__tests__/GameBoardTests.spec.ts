import { getGameBoard, move, resetGameBoard } from '../../logic/GameBoardHandler'
import { GameBoard } from '../../logic/GameBoard'
import { describe, expect, test, beforeEach } from 'vitest'

describe('move', () => {
  beforeEach(() => {
    resetGameBoard()
  })

  test('add piece to board legally', () => {
    expect(move(0, 0, 1)).toEqual(
      new GameBoard([
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
  })

  test('add piece to board illegally', () => {
    move(0, 0, 1)
    expect(() => move(0, 0, 2)).toThrowError('This piece cannot go there')
  })

  /*test('add piece outside of board', () => {
    expect(() => move(3, 3, 1)).toThrowError('Piece is outside of board')
  })*/

  test('add piece to board legally, old gameboard should not change', () => {
    const oldBoard = getGameBoard()
    move(1, 1, 2)
    expect(oldBoard).toEqual(
      new GameBoard([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
  })
})
