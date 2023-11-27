import { getGameBoard, move } from '../../logic/GameBoardHandler'
import { GameBoard } from '../../logic/GameBoard'
import { describe, expect, test, beforeEach } from 'vitest'

describe('move', () => {
  let gameBoard: GameBoard

  beforeEach(() => {
    gameBoard = new GameBoard([[0, 0, 0], [0, 0, 0], [0, 0, 0]])
  })

  test('add piece to board legally', () => {
    expect(move(0, 0, 1, gameBoard)).toEqual(
      new GameBoard([
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
  })

  test('add piece to board illegally', () => {
    gameBoard = move(0, 0, 1, gameBoard)
    expect(() => move(0, 0, 2, gameBoard)).toThrowError('This piece cannot go there')
  })

  /*test('add piece outside of board', () => {
    expect(() => move(3, 3, 1)).toThrowError('Piece is outside of board')
  })*/

  test('add piece to board legally, old gameboard should not change', () => {
      const oldBoard = getGameBoard()
      move(1, 1, 2, oldBoard)
      expect(oldBoard).toEqual(
        new GameBoard([
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ])
      )
    })
})
