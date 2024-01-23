import { AIPlayer } from '@/logic/AIPlayer'
import { ErrorBackpropagationPolicy } from '@/logic/ErrorBackpropagationPolicy'
import { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import { describe, expect, beforeEach, test } from 'vitest'

const handler = GameHandler.getInstance()
const weights = new Map()

let policy: ErrorBackpropagationPolicy
let aI: AIPlayer
let history: GameBoard[]

beforeEach(() => {
  policy = new ErrorBackpropagationPolicy()
  aI = new AIPlayer(policy)
})

describe('getInitialWeight', () => {
  test('returns expected values', () => {
    expect(policy.getInitialWeight(0)).toBe(8)
    expect(policy.getInitialWeight(1)).toBe(7)
    expect(policy.getInitialWeight(2)).toBe(6)
    expect(policy.getInitialWeight(3)).toBe(5)
    expect(policy.getInitialWeight(4)).toBe(4)
    expect(policy.getInitialWeight(5)).toBe(3)
    expect(policy.getInitialWeight(6)).toBe(2)
    expect(policy.getInitialWeight(7)).toBe(1)
    expect(policy.getInitialWeight(8)).toBe(0)
  })

  test('throws error for invalid input', () => {
    expect(policy.getInitialWeight(-1)).toThrow("Height must be between 0 and 8")
    expect(policy.getInitialWeight(9)).toThrow("Height must be between 0 and 8")
  })
})

describe('applyPolicy to realistic example', () => {
  beforeEach(beforeSetupRealisticExample)

  test('does not change weights if game is not over', () => {
    const expected = aI.getVertexMap(history[2].getNormalForm())

    policy.applyPolicy(aI, history)

    expect(aI.getVertexMap(history[2].getNormalForm())).toBe(expected)
  })
})

describe('applyPolicy to artificial example', () => {
  beforeEach(beforeSetupArtificialExample)

  test('does not change weights if game is not over', () => {
    const expected = aI.getVertexMap(history[2].getNormalForm())

    policy.applyPolicy(aI, history)

    expect(aI.getVertexMap(history[2].getNormalForm())).toBe(expected)
  })
})

function beforeSetupRealisticExample() {
  weights.set(
    0,
    new Map([
      [1, 1],
      [10, 1],
      [10000, 1]
    ])
  )
  weights.set(10, new Map([[12, 1]]))
  weights.set(
    12,
    new Map([
      [10012, 1],
      [122, 1]
    ])
  )
  weights.set(
    10012,
    new Map([
      [12210, 1],
      [112200, 1]
    ])
  )
  weights.set(
    12210,
    new Map([
      [2111020, 1],
      [12211, 1]
    ])
  )
  history = [
    new GameBoard(),
    new GameBoard([
      [0, 0, 0],
      [1, 0, 0],
      [0, 0, 0]
    ]),
    new GameBoard([
      [2, 0, 0],
      [1, 0, 0],
      [0, 0, 0]
    ]),
    new GameBoard([
      [2, 0, 0],
      [1, 1, 0],
      [0, 0, 0]
    ]),
    new GameBoard([
      [2, 0, 0],
      [1, 1, 0],
      [0, 2, 0]
    ]),
    new GameBoard([
      [2, 0, 0],
      [1, 1, 1],
      [0, 2, 0]
    ])
  ]
  aI.weights = weights
  handler.getGBHandler().gameBoard.value = history[history.length - 1]
}

function beforeSetupArtificialExample() {
  history = [
    new GameBoard(),
    new GameBoard([
      [2, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]),
    new GameBoard([
      [2, 2, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]),
    new GameBoard([
      [2, 2, 2],
      [0, 0, 0],
      [0, 0, 0]
    ]),
    new GameBoard([
      [2, 2, 2],
      [2, 0, 0],
      [0, 0, 0]
    ]),
    new GameBoard([
      [2, 2, 2],
      [2, 2, 0],
      [0, 0, 0]
    ]),
    new GameBoard([
      [2, 2, 2],
      [2, 2, 2],
      [0, 0, 0]
    ])
  ]
  weights.set(
    0,
    new Map([
      [2, 1],
      [1, 1],
      [10, 1]
    ])
  )
  weights.set(
    2,
    new Map([
      [22, 1],
      [21, 1],
      [201, 1]
    ])
  )
  weights.set(
    22,
    new Map([
      [222, 1],
      [221, 1],
      [2201, 1]
    ])
  )
  weights.set(
    222,
    new Map([
      [2222, 1],
      [2221, 1],
      [22201, 1]
    ])
  )
  weights.set(
    2222,
    new Map([
      [22222, 1],
      [22221, 1],
      [222201, 1]
    ])
  )
  weights.set(
    22222,
    new Map([
      [222222, 1],
      [222221, 1],
      [2222201, 1]
    ])
  )
  aI.weights = weights
  handler.winner.value = 1
  handler.getGBHandler().gameBoard.value = history[history.length - 1]
}