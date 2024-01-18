import { GameBoardHandler } from '@/logic/GameBoardHandler'
import { GameBoard } from '@/logic/GameBoard'
import { beforeEach, describe, expect, test } from 'vitest'

let handler: GameBoardHandler

beforeEach(() => {
  handler = new GameBoardHandler()
})

describe('resetGame', () => {
  test('reset', () => {
    handler.move(0, 0, 1)
    const oldBoard = handler.getGameBoard()
    handler.resetGameBoard()
    expect(handler.getGameBoard()).not.toEqual(oldBoard)
    expect(handler.getGameBoard()).toEqual(new GameBoard())
    expect(handler.history.length == 1)
  })
})

describe('move', () => {
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

  test('add piece to already occupied space', () => {
    handler.move(0, 0, 1)
    expect(() => handler.move(0, 0, 2)).toThrowError('This piece cannot go there')
    expect(handler.history.length == 1)
  })

  test('add piece outside of board', () => {
    expect(() => handler.move(3, 0, 1)).toThrowError('This piece cannot go there')
    expect(handler.history.length == 1)
  })
})

describe('getGameBoard', () => {
  test('add piece to board legally, old gameboard should not change', () => {
    const oldBoard = handler.getGameBoard()
    handler.move(1, 1, 2)
    expect(oldBoard).toEqual(new GameBoard())
  })
})

describe('calculateCode', () => {
  test('calculate easy code', () => {
    handler.move(0, 0, 1)
    expect(handler.getGameBoard().code).toEqual(1)
  })

  test('calculate complex code', () => {
    handler.move(0, 0, 1)
    handler.move(1, 2, 2)
    handler.move(2, 1, 1)
    expect(handler.getGameBoard().code).toEqual(10200001)
  })
})

describe('getNormalForm', () => {
  test('easy normal form', () => {
    handler.move(0, 0, 1)
    expect(handler.getGameBoard().getNormalForm()).toEqual(1)
  })

  test('more complex normal form', () => {
    handler.move(0, 2, 1)
    handler.move(0, 0, 2)
    expect(handler.getGameBoard().getNormalForm()).toEqual(102)
  })
})
