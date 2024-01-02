import { GameBoard, calculateCode } from '@/logic/GameBoard'
import { IsomorphismGroup } from '@/logic/IsomorphismGroup'
import { beforeEach, describe, expect, test } from 'vitest'

describe('getGameBoardEquiv', () => {
  test('Empty board', () => {
    const gameBoard = new GameBoard()
    const equivs = IsomorphismGroup.getGameBoardEquiv(gameBoard)
    expect(equivs.size).toEqual(1)
    expect(equivs.has(0)).toEqual(true)
  })

  test('One piece in corner board', () => {
    const gameBoard = new GameBoard()
    gameBoard.state = [
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
    const equivs = IsomorphismGroup.getGameBoardEquiv(gameBoard)
    expect(equivs.size).toEqual(4)
    const expectedCodes = [
      calculateCode([
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]),
      calculateCode([
        [0, 0, 1],
        [0, 0, 0],
        [0, 0, 0]
      ]),
      calculateCode([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 1]
      ]),
      calculateCode([
        [0, 0, 0],
        [0, 0, 0],
        [1, 0, 0]
      ])
    ]
    for (const code of expectedCodes) {
      expect(equivs.has(code)).toEqual(true)
    }
  })

  test('One piece in corner board, one adjacent', () => {
    const gameBoard = new GameBoard()
    gameBoard.state = [
      [1, 2, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
    const equivs = IsomorphismGroup.getGameBoardEquiv(gameBoard)
    expect(equivs.size).toEqual(8)
    const expectedCodes = [
      calculateCode([
        [1, 2, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]),
      calculateCode([
        [0, 2, 1],
        [0, 0, 0],
        [0, 0, 0]
      ]),
      calculateCode([
        [0, 0, 1],
        [0, 0, 2],
        [0, 0, 0]
      ]),
      calculateCode([
        [0, 0, 0],
        [0, 0, 2],
        [0, 0, 1]
      ]),
      calculateCode([
        [0, 0, 0],
        [0, 0, 0],
        [0, 2, 1]
      ]),
      calculateCode([
        [0, 0, 0],
        [0, 0, 0],
        [1, 2, 0]
      ]),
      calculateCode([
        [0, 0, 0],
        [2, 0, 0],
        [1, 0, 0]
      ]),
      calculateCode([
        [1, 0, 0],
        [2, 0, 0],
        [0, 0, 0]
      ])
    ]
    for (const code of expectedCodes) {
      expect(equivs.has(code)).toEqual(true)
    }
  })

  test('Highly symmetric board', () => {
    const gameBoard = new GameBoard()
    gameBoard.state = [
      [2, 1, 2],
      [1, 0, 1],
      [2, 1, 2]
    ]
    const expectedCode = calculateCode(gameBoard.state)
    const equivs = IsomorphismGroup.getGameBoardEquiv(gameBoard)
    expect(equivs.size).toEqual(1)
    expect(equivs.has(expectedCode)).toEqual(true)
  })

  test('Board with one reflection symmetry', () => {
    const gameBoard = new GameBoard()
    gameBoard.state = [
      [2, 0, 2],
      [1, 0, 1],
      [0, 0, 0]
    ]
    const equivs = IsomorphismGroup.getGameBoardEquiv(gameBoard)
    expect(equivs.size).toEqual(4)
    const expectedCodes = [
      calculateCode([
        [2, 0, 2],
        [1, 0, 1],
        [0, 0, 0]
      ]),
      calculateCode([
        [0, 1, 2],
        [0, 0, 0],
        [0, 1, 2]
      ]),
      calculateCode([
        [0, 0, 0],
        [1, 0, 1],
        [2, 0, 2]
      ]),
      calculateCode([
        [2, 1, 0],
        [0, 0, 0],
        [2, 1, 0]
      ])
    ]
    for (const code of expectedCodes) {
      expect(equivs.has(code)).toEqual(true)
    }
  })

  test('Board with one entry in the center', () => {
    const gameBoard = new GameBoard()
    gameBoard.state = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0]
    ]
    const expectedCode = calculateCode(gameBoard.state)
    const equivs = IsomorphismGroup.getGameBoardEquiv(gameBoard)
    expect(equivs.size).toEqual(1)
    expect(equivs.has(expectedCode)).toEqual(true)
  })
})

describe('SingleNormalForm', () => {
  let gameBoard: GameBoard
  beforeEach(() => {
    gameBoard = new GameBoard()
  })

  test('Empty board', () => {
    const normalForm = IsomorphismGroup.getNormalFormOfGameBoard(gameBoard)
    expect(normalForm).toEqual(0)
  })

  test('Already in normal form', () => {
    gameBoard.state = [
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
    const normalForm = IsomorphismGroup.getNormalFormOfGameBoard(gameBoard)
    expect(normalForm).toEqual(1)
  })

  test('Not in normal form', () => {
    gameBoard.state = [
      [0, 0, 1],
      [0, 0, 0],
      [0, 0, 0]
    ]
    const normalForm = IsomorphismGroup.getNormalFormOfGameBoard(gameBoard)
    expect(normalForm).toEqual(1)
  })
})
