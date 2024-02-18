import { GameHandler } from '@/logic/GameHandler'
import { beforeEach, describe, expect, test, vi, type MockInstance } from 'vitest'
import { gameBoardDraw, gameBoardWinPlayer1, resetGameHandler } from './TestUtil'
import { GameBoard } from '@/logic/GameBoard'
import { AIPlayer } from '@/logic/AIPlayer'
import { EliminationPolicySimple } from '@/logic/EliminationPolicySimple'
import { BackpropagationPolicy } from '@/logic/BackpropagationPolicy'
vi.mock('@/utils/GraphExport', () => {
  return {
    updateHistory: vi.fn(),
    initializeHistory: vi.fn(),
    resetHistory: vi.fn()
  }
})
vi.mock('@/utils/LabelExport', () => {
  return {
    updateLabels: vi.fn()
  }
})

let handler: GameHandler

beforeEach(() => {
  resetGameHandler()
  handler = GameHandler.getInstance()
})

describe('resetGame', () => {
  test('reset', () => {
    handler.performTurn(0, 0)
    handler.resetGame()
    expect(handler.getWinner().value).toEqual(null)
    expect(handler.getPlayerOnTurn().value).toEqual(1)
  })
})

describe('performTurn', () => {
  test('No turn after victory', () => {
    handler.winner.value = 1
    handler.performTurn(0, 0)
    expect(handler.getGBHandler().getGameBoard().state[0][0]).toEqual(0)
  })
  test('PlayerOnTurn changes after each turn', () => {
    handler.performTurn(0, 0)
    expect(handler.getPlayerOnTurn().value).toEqual(2)
    expect(handler.getGBHandler().getGameBoard().state[0][0]).toEqual(1)
    handler.performTurn(0, 1)
    expect(handler.getPlayerOnTurn().value).toEqual(1)
    expect(handler.getGBHandler().getGameBoard().state[0][1]).toEqual(2)
  })
})

describe('getPossibleNextPositions', () => {
  let nextTurns: GameBoard[] = []
  test('first turn', () => {
    nextTurns = handler.getPossibleNextPositions()
    expect(nextTurns.length).toEqual(9)
    expect(nextTurns[0].state).toEqual([
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ])
    expect(nextTurns[1].state).toEqual([
      [0, 1, 0],
      [0, 0, 0],
      [0, 0, 0]
    ])
    expect(nextTurns[2].state).toEqual([
      [0, 0, 1],
      [0, 0, 0],
      [0, 0, 0]
    ])
    expect(nextTurns[3].state).toEqual([
      [0, 0, 0],
      [1, 0, 0],
      [0, 0, 0]
    ])
    expect(nextTurns[4].state).toEqual([
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0]
    ])
    expect(nextTurns[5].state).toEqual([
      [0, 0, 0],
      [0, 0, 1],
      [0, 0, 0]
    ])
    expect(nextTurns[6].state).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [1, 0, 0]
    ])
    expect(nextTurns[7].state).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 1, 0]
    ])
    expect(nextTurns[8].state).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 1]
    ])
  })

  test('later turn', () => {
    handler.getGBHandler().gameBoard.value = new GameBoard([
      [1, 2, 0],
      [1, 2, 0],
      [0, 0, 0]
    ])
    nextTurns = handler.getPossibleNextPositions()
    expect(nextTurns.length).toEqual(5)
    expect(nextTurns[0].state).toEqual([
      [1, 2, 1],
      [1, 2, 0],
      [0, 0, 0]
    ])
    expect(nextTurns[1].state).toEqual([
      [1, 2, 0],
      [1, 2, 1],
      [0, 0, 0]
    ])
    expect(nextTurns[2].state).toEqual([
      [1, 2, 0],
      [1, 2, 0],
      [1, 0, 0]
    ])
    expect(nextTurns[3].state).toEqual([
      [1, 2, 0],
      [1, 2, 0],
      [0, 1, 0]
    ])
    expect(nextTurns[4].state).toEqual([
      [1, 2, 0],
      [1, 2, 0],
      [0, 0, 1]
    ])
  })

  test('player won', () => {
    handler.getGBHandler().gameBoard.value = gameBoardWinPlayer1
    nextTurns = handler.getPossibleNextPositions()
    expect(nextTurns.length).toEqual(0)
  })

  test('draw', () => {
    handler.getGBHandler().gameBoard.value = gameBoardDraw
    nextTurns = handler.getPossibleNextPositions()
    expect(nextTurns.length).toEqual(0)
  })
})

describe('performEndOfGameActions', () => {
  test('should apply policy to both AIs', () => {
    handler.settings.player1 = new AIPlayer(new EliminationPolicySimple(), 'KI 1')
    handler.settings.player2 = new AIPlayer(new EliminationPolicySimple(), 'KI 2')
    const spy1 = vi.spyOn(handler.settings.player1 as AIPlayer, 'applyPolicy')
    const spy2 = vi.spyOn(handler.settings.player2 as AIPlayer, 'applyPolicy')
    handler.performEndOfGameActions(true)
    expect(spy1).toHaveBeenCalled()
    expect(spy2).toHaveBeenCalled()
  })

  test('should apply policy to same AI only once', () => {
    handler.settings.player1 = new AIPlayer(new EliminationPolicySimple(), 'KI 1')
    handler.settings.player2 = handler.settings.player1
    const spy1 = vi.spyOn(handler.settings.player1 as AIPlayer, 'applyPolicy')
    handler.performEndOfGameActions(true)
    expect(spy1).toHaveBeenCalledTimes(1)
  })

  test('should apply policy to AI in position two', () => {
    handler.settings.player1 = handler.humanPlayer
    handler.settings.player2 = new AIPlayer(new EliminationPolicySimple(), 'KI 1')
    const spy = vi.spyOn(handler.settings.player2 as AIPlayer, 'applyPolicy')
    handler.performEndOfGameActions(true)
    expect(spy).toHaveBeenCalledTimes(1)
  })
})

describe('getNumberOfAIs', () => {
  test('One AI', () => {
    handler.settings.player1 = new AIPlayer(new EliminationPolicySimple(), 'KI 1')
    handler.settings.player2 = handler.humanPlayer
    expect(handler.getNumberOfAIs()).toEqual(1)
  })
  test('Two AIs', () => {
    handler.settings.player1 = new AIPlayer(new EliminationPolicySimple(), 'KI 1')
    handler.settings.player2 = new AIPlayer(new EliminationPolicySimple(), 'KI 2')
    expect(handler.getNumberOfAIs()).toEqual(2)
  })
  test('No AI', () => {
    handler.settings.player1 = handler.humanPlayer
    handler.settings.player2 = handler.humanPlayer
    expect(handler.getNumberOfAIs()).toEqual(0)
  })
})

describe('createAI', () => {
  test('EliminationPolicy', () => {
    handler.createAI(0, 'KI 1')
    const ai: AIPlayer = handler.possiblePlayers[4] as AIPlayer
    expect(ai.policy).toBeInstanceOf(EliminationPolicySimple)
  })
  test('BackpropagationPolicy', () => {
    handler.createAI(1, 'KI 1')
    const ai: AIPlayer = handler.possiblePlayers[4] as AIPlayer
    expect(ai.policy).toBeInstanceOf(BackpropagationPolicy)
  })
  test('Invalid option', () => {
    expect(() => handler.createAI(3, 'KI 1')).toThrow('Invalid AI option')
  })
})

describe('resetAiWeights', () => {
  let spy1: MockInstance<[], void>
  let spy2: MockInstance<[], void>
  beforeEach(() => {
    spy1 = vi.spyOn(handler.settings.player2 as AIPlayer, 'resetWeights')
    spy2 = vi.spyOn(handler.possiblePlayers[2] as AIPlayer, 'resetWeights')
  })
  test('reset weights of first AI calls reset method on respective AIPlayer', () => {
    handler.resetAiWeights(1)
    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(0)
  })

  test('reset weights of human throws error', () => {
    expect(() => handler.resetAiWeights(0)).toThrowError()
    expect(spy1).toHaveBeenCalledTimes(0)
    expect(spy2).toHaveBeenCalledTimes(0)
  })

  test('reset weights of non existing AI throws error', () => {
    expect(() => handler.resetAiWeights(4)).toThrowError('This player is not known.')
    expect(spy1).toHaveBeenCalledTimes(0)
    expect(spy2).toHaveBeenCalledTimes(0)
  })

  test('reset weights of second AI calls reset method on respective AIPlayer', () => {
    handler.resetAiWeights(2)
    expect(spy1).toHaveBeenCalledTimes(0)
    expect(spy2).toHaveBeenCalledTimes(1)
  })
})
