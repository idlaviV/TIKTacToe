import { GameBoard } from '@/logic/GameBoard'
import { GameBoardHandler } from '@/logic/GameBoardHandler'
import type { GameBoardWithPrevMove } from '@/logic/Moves'
import { drawStatus } from '@/logic/WinnerStatus'
import { beforeEach, describe, expect, test } from 'vitest'
import { gameBoardDraw, gameBoardWinPlayer1, gameBoardWinPlayer2 } from './TestUtil'

let handler: GameBoardHandler
beforeEach(() => {
  handler = new GameBoardHandler()
})

describe('calculation of winner', () => {
  test('player 1 win', () => {
    handler.gameBoard.value = gameBoardWinPlayer1
    expect(handler.calculateWinner()).toEqual(1)
  })

  test('player 2 win', () => {
    handler.gameBoard.value = gameBoardWinPlayer2
    expect(handler.calculateWinner()).toEqual(2)
  })

  test('draw', () => {
    handler.gameBoard.value = gameBoardDraw
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

describe('getPossibleNextPositionsWithMoves', () => {
    let nextTurns: GameBoardWithPrevMove[] = []
    test('first turn', () => {
      nextTurns = handler.getPossibleNextPositions(1)
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
        handler.gameBoard.value = new GameBoard([
            [1,1,0],
            [2,2,0],
            [0,0,0]
        ])
        nextTurns = handler.getPossibleNextPositions(1)
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
        handler.gameBoard.value = gameBoardWinPlayer1
        nextTurns = handler.getPossibleNextPositions(2)
        expect(nextTurns.length).toEqual(0)
      })
    
      test('draw', () => {
        handler.gameBoard.value = gameBoardDraw
        nextTurns = handler.getPossibleNextPositions(2)
        expect(nextTurns.length).toEqual(0)
      })

})


