import { AIPlayer } from '@/logic/AIPlayer'
import { GameBoard } from '@/logic/GameBoard'
import type { GameBoardHandler } from '@/logic/GameBoardHandler'
import { GameHandler } from '@/logic/GameHandler'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { resetGameHandler } from './TestUtil'
import { EliminationPolicy } from '@/logic/EliminationPolicy'
import type { EvaluationPolicy } from '@/logic/EvaluationPolicy'
import { maxFromAI , debugRandomizerFactory} from './TestUtil'

let gameHandler: GameHandler
let gBHandler: GameBoardHandler
let policy: EvaluationPolicy
let player: AIPlayer
const debugRandomizer = debugRandomizerFactory()

beforeEach(() => {
  resetGameHandler()
  gameHandler = GameHandler.getInstance()
  policy = new EliminationPolicy()
  player = new AIPlayer(policy)
  player.randomzier = debugRandomizer
  gBHandler = gameHandler.getGBHandler()
})

describe('perform turn on empty board', () => {
  test('option1', () => {
    debugRandomizer.setRandomNumber(1)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(player.weights.get(0)?.size).toEqual(3)
    expect(player.weights.get(0)?.get(1)).toEqual(1)
    expect(player.weights.get(0)?.get(10)).toEqual(1)
    expect(player.weights.get(0)?.get(10000)).toEqual(1)
    expect(maxFromAI).toEqual(3)
  })
  test('option2', () => {
    debugRandomizer.setRandomNumber(2)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [0, 1, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
  })
  test('option3', () => {
    debugRandomizer.setRandomNumber(3)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ])
    )
  })
  test('illegal option', () => {
    debugRandomizer.setRandomNumber(4)
    expect(() => player.makeMove()).toThrowError()
  })
})

describe('perform turn on one-tile-board', () => {
  beforeEach(() => {
    gameHandler.performTurn(0, 0)
  })
  test('option1', () => {
    debugRandomizer.setRandomNumber(1)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [1, 2, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(player.weights.get(1)?.size).toEqual(5)
    expect(player.weights.get(1)?.get(21)).toEqual(1)
    expect(player.weights.get(1)?.get(102)).toEqual(1)
    expect(player.weights.get(1)?.get(20001)).toEqual(1)
    expect(player.weights.get(1)?.get(2100)).toEqual(1)
    expect(player.weights.get(1)?.get(1000200)).toEqual(1)
    expect(maxFromAI).toEqual(5)
  })
  test('option2', () => {
    debugRandomizer.setRandomNumber(2)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [1, 0, 2],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
  })
  test('option3', () => {
    debugRandomizer.setRandomNumber(3)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [1, 0, 0],
        [0, 2, 0],
        [0, 0, 0]
      ])
    )
  })
  test('option4', () => {
    debugRandomizer.setRandomNumber(4)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [1, 0, 0],
        [0, 0, 2],
        [0, 0, 0]
      ])
    )
  })
  test('option3', () => {
    debugRandomizer.setRandomNumber(5)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 2]
      ])
    )
  })
})

describe('perform turn on empty board with changed weights', () => {
  beforeEach(() => {
    player.initializeWeights(0)
    player.weights.get(0)?.set(1, 0)
    player.weights.get(0)?.set(10, 2)
    player.weights.get(0)?.set(10000, 1)
  })
  test('option 1', () => {
    debugRandomizer.setRandomNumber(1)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [0, 1, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(maxFromAI).toEqual(3)
  })
  test('option 2', () => {
    debugRandomizer.setRandomNumber(2)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [0, 1, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
  })
  test('option 3', () => {
    debugRandomizer.setRandomNumber(3)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ])
    )
  })
  test('Illegal option', () => {
    debugRandomizer.setRandomNumber(4)
    expect(() => player.makeMove()).toThrowError()
  })
})

describe('perform turn on empty board without options', () => {
  beforeEach(() => {
    player.initializeWeights(0)
    player.weights.get(0)?.set(1, 0)
    player.weights.get(0)?.set(10, 0)
    player.weights.get(0)?.set(10000, 0)
  })
  test('option1', () => {
    debugRandomizer.setRandomNumber(1)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(player.weights.get(0)?.size).toEqual(3)
    expect(player.weights.get(0)?.get(1)).toEqual(0)
    expect(player.weights.get(0)?.get(10)).toEqual(0)
    expect(player.weights.get(0)?.get(10000)).toEqual(0)
    expect(maxFromAI).toEqual(3)
  })
  test('option2', () => {
    debugRandomizer.setRandomNumber(2)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [0, 1, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
  })
  test('option3', () => {
    debugRandomizer.setRandomNumber(3)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ])
    )
  })
  test('illegal option', () => {
    debugRandomizer.setRandomNumber(4)
    expect(() => player.makeMove()).toThrowError()
  })
})

describe('perform turn on complicated board', () => {
  beforeEach(() => {
    gBHandler.gameBoard.value = new GameBoard([
      [2, 0, 2],
      [2, 1, 1],
      [1, 0, 0]
    ])
  })
  test('option1', () => {
    debugRandomizer.setRandomNumber(1)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [2, 1, 2],
        [2, 1, 1],
        [1, 0, 0]
      ])
    )
    expect(player.weights.get(1112202)?.size).toEqual(3)
    expect(player.weights.get(1112202)?.get(1112212)).toEqual(1)
    expect(player.weights.get(1112202)?.get(11112202)).toEqual(1)
    expect(player.weights.get(1112202)?.get(101112202)).toEqual(1)
    expect(maxFromAI).toEqual(3)
  })
  test('option2', () => {
    debugRandomizer.setRandomNumber(2)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [2, 0, 2],
        [2, 1, 1],
        [1, 1, 0]
      ])
    )
  })
  test('option3', () => {
    debugRandomizer.setRandomNumber(3)
    player.makeMove()
    expect(gBHandler.getGameBoard()).toEqual(
      new GameBoard([
        [2, 0, 2],
        [2, 1, 1],
        [1, 0, 1]
      ])
    )
  })
})

describe('applyPolicy', () => {
  test('eliminationPolicy', () => {
    const policySpy = vi.spyOn(policy, 'applyPolicy')

    expect(policySpy).not.toHaveBeenCalled()

    player.applyPolicy()

    expect(policySpy).toHaveBeenCalledWith(player, gBHandler.history)
  })
})
