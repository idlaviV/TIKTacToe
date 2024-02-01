import { GameBoardHandler } from '@/logic/GameBoardHandler'
import { GameBoard, getGameBoardFromCode } from '@/logic/GameBoard'
import { beforeEach, describe, expect, test } from 'vitest'
import { gameBoard1, gameBoard10, gameBoard10000, gameBoard1rot, gameBoard21 } from './TestUtil'

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
    expect(() => handler.move(0, 0, 2)).toThrowError('Player 2 cannot move to (0,0)')
    expect(handler.history.length == 1)
  })

  test('add piece outside of board', () => {
    expect(() => handler.move(3, 0, 1)).toThrowError('Player 1 cannot move to (3,0)')
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

describe('getGameBoardFromCode', () => {
  test('standard Codes', () => {
    expect(getGameBoardFromCode(0)).toEqual(
      new GameBoard()
    )
    expect(getGameBoardFromCode(1)).toEqual(
      gameBoard1
    )
    expect(getGameBoardFromCode(10)).toEqual(
      gameBoard10
    )
    expect(getGameBoardFromCode(100)).toEqual(
      gameBoard1rot
    )
    expect(getGameBoardFromCode(10000)).toEqual(
      gameBoard10000
    )
    expect(getGameBoardFromCode(21)).toEqual(
      gameBoard21
    )
    expect(getGameBoardFromCode(102)).toEqual(
      new GameBoard([
        [2, 0, 1],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(getGameBoardFromCode(112212121)).toEqual(
      new GameBoard([
        [1, 2, 1],
        [2, 1, 2],
        [2, 1, 1]
      ])
    )
  })

  test('custom codes', () => {
    expect(getGameBoardFromCode(2)).toEqual(
      new GameBoard([
        [2, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(getGameBoardFromCode(22)).toEqual(
      new GameBoard([
        [2, 2, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(getGameBoardFromCode(222222222)).toEqual(
      new GameBoard([
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2]
      ])
    )
  })

  test('invalid codes', () => {
    expect(() => getGameBoardFromCode(3)).toThrowError()
    expect(() => getGameBoardFromCode(1111111111)).toThrowError()
  })
})

describe('toString', () => {
  test('empty board', () => {
    expect(new GameBoard().toString()).toEqual('| | | |\n| | | |\n| | | |\n')
  })
  test('complex board', () => {
    expect(
      new GameBoard([
        [1, 2, 0],
        [0, 2, 1],
        [2, 2, 2]
      ]).toString()
    ).toEqual('|X|O| |\n| |O|X|\n|O|O|O|\n')
  })
})
