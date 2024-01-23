import { GameBoard, calculateCode } from '@/logic/GameBoard'
import { IsomorphismGroup } from '@/logic/IsomorphismGroup'
import { beforeEach, describe, expect, test } from 'vitest'
import * as Util from './TestUtil'
import { ArrayMultimap } from '@teppeis/multimaps'
import type { GameBoardCode } from '@/logic/Codes'

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

describe('getRepresentativeOfGameBoards', () => {
  let boards = []
  let representative = -1
  test('One Element', () => {
    boards = [1]
    representative = IsomorphismGroup.getRepresentativeOfGameBoards(...boards)
    expect(representative).toEqual(1)
  })

  test('Multiple Elements', () => {
    boards = [1, 100, 1000000, 100000000]
    representative = IsomorphismGroup.getRepresentativeOfGameBoards(...boards)
    expect(representative).toEqual(1)
  })
})

describe('getRepresentativesOfNonequivalentGameBoards', () => {
  let boards: GameBoard[]
  let representative: ArrayMultimap<GameBoardCode, GameBoardCode>
  beforeEach(() => {
    boards = []
  })

  test('Empty array', () => {
    representative = IsomorphismGroup.getRepresentativesOfNonequivalentGameBoards(boards)
    expect(extractNormalforms(representative)).toEqual([])
  })

  test('Single element', () => {
    boards.push(Util.gameBoard21)
    representative = IsomorphismGroup.getRepresentativesOfNonequivalentGameBoards(boards)
    expect(extractNormalforms(representative)).toEqual([21])
    expect(representative.get(21)).toEqual([21])
  })
  test('Multiple equivalent elements', () => {
    boards.push(Util.gameBoard21)
    boards.push(Util.gameBoard120)
    representative = IsomorphismGroup.getRepresentativesOfNonequivalentGameBoards(boards)
    expect(extractNormalforms(representative)).toEqual([21])
    expect(representative.get(21)).toEqual([21, 120])
  })
  test('Multiple nonequivalent elements', () => {
    boards.push(Util.gameBoard21)
    boards.push(Util.gameBoard2100)
    representative = IsomorphismGroup.getRepresentativesOfNonequivalentGameBoards(boards)
    expect(extractNormalforms(representative)).toEqual([21, 2100])
    expect(representative.get(21)).toEqual([21])
    expect(representative.get(2100)).toEqual([2100])
  })
  test('Multiple nonequivalent and equivalent elements', () => {
    boards.push(Util.gameBoard21)
    boards.push(Util.gameBoard120)
    boards.push(Util.gameBoard2100)
    representative = IsomorphismGroup.getRepresentativesOfNonequivalentGameBoards(boards)
    expect(extractNormalforms(representative)).toEqual([21, 2100])
    expect(representative.get(21)).toEqual([21, 120])
    expect(representative.get(2100)).toEqual([2100])
  })
})

function extractNormalforms(output:ArrayMultimap<GameBoardCode, GameBoardCode>): number[] {
  const normalForms: Set<number> = new Set()
  output.forEach((value,key) => {
    normalForms.add(key)
  })
  return Array.from(normalForms.values())
}
