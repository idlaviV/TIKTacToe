import { AIPlayer } from '@/logic/AIPlayer'
import { BackpropagationPolicy } from '@/logic/BackpropagationPolicy'
import { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import { drawStatus } from '@/logic/WinnerStatus'
import { describe, expect, beforeEach, test, vi } from 'vitest'
import { getWeightClone } from './TestUtil'

vi.mock('@/utils/GraphExport', () => {
  return {
    graphExport: { value: { edges: {} } },
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

const handler = GameHandler.getInstance()
const weights = new Map()

let policy: BackpropagationPolicy
let aI: AIPlayer
let history: GameBoard[]

beforeEach(() => {
  policy = new BackpropagationPolicy()
  aI = new AIPlayer(policy)
})

describe('constructor', () => {
  test('initializes diffs correctly', () => {
    expect(policy.winDiff).toBe(3)
    expect(policy.drawDiff).toBe(1)
    expect(policy.loseDiff).toBe(-1)
  })

  test('initialize diffs with invalid inputs', () => {
    expect(() => new BackpropagationPolicy(NaN, 1, -1)).toThrow(new Error('winDiff ' + NaN + ' is illegal'))
    expect(() => new BackpropagationPolicy(3, NaN, -1)).toThrow(new Error('drawDiff ' + NaN + ' is illegal'))
    expect(() => new BackpropagationPolicy(3, 1, NaN)).toThrow(new Error('loseDiff ' + NaN + ' is illegal'))

    expect(() => new BackpropagationPolicy(1.2, 1, -1)).toThrow(new Error('winDiff ' + 1.2 + ' is illegal'))
    expect(() => new BackpropagationPolicy(3, 1.2, -1)).toThrow(new Error('drawDiff ' + 1.2 + ' is illegal'))
    expect(() => new BackpropagationPolicy(3, 1, 1.2)).toThrow(new Error('loseDiff ' + 1.2 + ' is illegal'))

    expect(() => new BackpropagationPolicy(1001, -1001, 1001)).toThrow(new Error('Diffs (' + 1001 + ',' + -1001 + ',' + 1001 + ') out of bound!'))
  })
})

describe('setDiffs', () => {
  test('sets diffs correctly', () => {
    policy.setDiffs(1, 2, 3)
    expect(policy.winDiff).toBe(1)
    expect(policy.drawDiff).toBe(2)
    expect(policy.loseDiff).toBe(3)
  })

  test('invalid inputs', () => {
    policy.setDiffs(NaN, 1, -1)
    expect(policy.winDiff).toBe(3)
    policy.setDiffs(3, NaN, -1)
    expect(policy.drawDiff).toBe(1)
    policy.setDiffs(3, 1, NaN)
    expect(policy.loseDiff).toBe(-1)

    policy.setDiffs(1.2, 1, -1)
    expect(policy.winDiff).toBe(3)
    policy.setDiffs(3, 1.2, -1)
    expect(policy.drawDiff).toBe(1)
    policy.setDiffs(3, 1, 1.2)
    expect(policy.loseDiff).toBe(-1)

    policy.setDiffs(1001, -1001, 1001)
    expect(policy.winDiff).toBe(1000)
    expect(policy.drawDiff).toBe(-1000)
    expect(policy.loseDiff).toBe(1000)
  })
})

describe('getInitialWeight', () => {
  test('returns expected values', () => {
    expect(policy.getInitialWeight(0)).toBe(9)
    expect(policy.getInitialWeight(1)).toBe(8)
    expect(policy.getInitialWeight(2)).toBe(7)
    expect(policy.getInitialWeight(3)).toBe(6)
    expect(policy.getInitialWeight(4)).toBe(5)
    expect(policy.getInitialWeight(5)).toBe(4)
    expect(policy.getInitialWeight(6)).toBe(3)
    expect(policy.getInitialWeight(7)).toBe(2)
    expect(policy.getInitialWeight(8)).toBe(1)
  })

  test('throws error for invalid input', () => {
    expect(() => policy.getInitialWeight(-1)).toThrow(new Error('Height must be between 0 and 8'))
    expect(() => policy.getInitialWeight(9)).toThrow(new Error('Height must be between 0 and 8'))
  })
})

describe('applyPolicy to realistic example', () => {
  beforeEach(beforeSetupRealisticExample)

  test('should not change weights if game is not over', () => {
    handler.winner.value = null

    const oldWeights = getWeightClone(aI.weights)
    policy.applyPolicy(aI, history)
    expect(aI.weights).toEqual(oldWeights)
  })

  test('game ends with draw', () => {
    handler.winner.value = drawStatus
    policy.applyPolicy(aI, history)
    expect(
      aI.weights
        .get(history[history.length - 2].getNormalForm())
        ?.get(history[history.length - 1].getNormalForm())
    ).toEqual(policy.getInitialWeight(4) + 1)
    expect(
      aI.weights
        .get(history[history.length - 3].getNormalForm())
        ?.get(history[history.length - 2].getNormalForm())
    ).toEqual(policy.getInitialWeight(3) + 1)
    expect(
      aI.weights
        .get(history[history.length - 4].getNormalForm())
        ?.get(history[history.length - 3].getNormalForm())
    ).toEqual(policy.getInitialWeight(2) + 1)
    expect(
      aI.weights
        .get(history[history.length - 5].getNormalForm())
        ?.get(history[history.length - 4].getNormalForm())
    ).toEqual(policy.getInitialWeight(1) + 1)
    expect(
      aI.weights
        .get(history[history.length - 6].getNormalForm())
        ?.get(history[history.length - 5].getNormalForm())
    ).toEqual(policy.getInitialWeight(0) + 1)
    expect(aI.weights.get(new GameBoard().getNormalForm())?.get(1)).toEqual(
      policy.getInitialWeight(0) // <--- remains unchanged
    )
  })

  test('game ends with win and loss', () => {
    handler.winner.value = 1
    policy.applyPolicy(aI, history)
    expect(
      aI.weights
        .get(history[history.length - 2].getNormalForm())
        ?.get(history[history.length - 1].getNormalForm())
    ).toEqual(policy.getInitialWeight(4) + 3)
    expect(
      aI.weights
        .get(history[history.length - 3].getNormalForm())
        ?.get(history[history.length - 2].getNormalForm())
    ).toEqual(policy.getInitialWeight(3) - 1)
    expect(
      aI.weights
        .get(history[history.length - 4].getNormalForm())
        ?.get(history[history.length - 3].getNormalForm())
    ).toEqual(policy.getInitialWeight(2) + 3)
    expect(
      aI.weights
        .get(history[history.length - 5].getNormalForm())
        ?.get(history[history.length - 4].getNormalForm())
    ).toEqual(policy.getInitialWeight(1) - 1)
    expect(
      aI.weights
        .get(history[history.length - 6].getNormalForm())
        ?.get(history[history.length - 5].getNormalForm())
    ).toEqual(policy.getInitialWeight(0) + 3)
    expect(aI.weights.get(new GameBoard().getNormalForm())?.get(1)).toEqual(
      policy.getInitialWeight(0) // <--- remains unchanged
    )
  })

  test('apply different changes', () => {
    handler.winner.value = 1
    policy.setDiffs(5, -1, 1)
    policy.applyPolicy(aI, history)
    expect(
      aI.weights
        .get(history[history.length - 2].getNormalForm())
        ?.get(history[history.length - 1].getNormalForm())
    ).toEqual(policy.getInitialWeight(4) + 5)
    expect(
      aI.weights
        .get(history[history.length - 3].getNormalForm())
        ?.get(history[history.length - 2].getNormalForm())
    ).toEqual(policy.getInitialWeight(3) + 1)
    expect(
      aI.weights
        .get(history[history.length - 4].getNormalForm())
        ?.get(history[history.length - 3].getNormalForm())
    ).toEqual(policy.getInitialWeight(2) + 5)
    expect(
      aI.weights
        .get(history[history.length - 5].getNormalForm())
        ?.get(history[history.length - 4].getNormalForm())
    ).toEqual(policy.getInitialWeight(1) + 1)
    expect(
      aI.weights
        .get(history[history.length - 6].getNormalForm())
        ?.get(history[history.length - 5].getNormalForm())
    ).toEqual(policy.getInitialWeight(0) + 5)
  })
})

describe('applyPolicy to artificial example', () => {
  beforeEach(beforeSetupArtificialExample)

  test('standard loss', () => {
    policy.applyPolicy(aI, history)

    expect(aI.weights.get(22222)?.get(222222)).toEqual(7)
    expect(aI.weights.get(22222)?.get(222221)).toEqual(4)
    expect(aI.weights.get(22222)?.get(2222201)).toEqual(4)
    expect(aI.weights.get(2222)?.get(22222)).toEqual(4)
    expect(aI.weights.get(2222)?.get(22221)).toEqual(5)
    expect(aI.weights.get(2222)?.get(222201)).toEqual(5)
    expect(aI.weights.get(222)?.get(2222)).toEqual(9)
    expect(aI.weights.get(222)?.get(2221)).toEqual(6)
    expect(aI.weights.get(222)?.get(22201)).toEqual(6)
    expect(aI.weights.get(22)?.get(222)).toEqual(6)
    expect(aI.weights.get(22)?.get(221)).toEqual(7)
    expect(aI.weights.get(22)?.get(2201)).toEqual(7)
    expect(aI.weights.get(2)?.get(22)).toEqual(11)
    expect(aI.weights.get(2)?.get(21)).toEqual(8)
    expect(aI.weights.get(2)?.get(201)).toEqual(8)
    expect(aI.weights.get(0)?.get(2)).toEqual(8)
    expect(aI.weights.get(0)?.get(1)).toEqual(9)
    expect(aI.weights.get(0)?.get(10)).toEqual(9)
  })

  test('loss with changed weights', () => {
    policy.setDiffs(5, -1, 1)
    policy.applyPolicy(aI, history)
    expect(aI.weights.get(22222)?.get(222222)).toEqual(9)
    expect(aI.weights.get(22222)?.get(222221)).toEqual(4)
    expect(aI.weights.get(22222)?.get(2222201)).toEqual(4)
    expect(aI.weights.get(2222)?.get(22222)).toEqual(6)
    expect(aI.weights.get(2222)?.get(22221)).toEqual(5)
    expect(aI.weights.get(2222)?.get(222201)).toEqual(5)
    expect(aI.weights.get(222)?.get(2222)).toEqual(11)
    expect(aI.weights.get(222)?.get(2221)).toEqual(6)
    expect(aI.weights.get(222)?.get(22201)).toEqual(6)
    expect(aI.weights.get(22)?.get(222)).toEqual(8)
    expect(aI.weights.get(22)?.get(221)).toEqual(7)
    expect(aI.weights.get(22)?.get(2201)).toEqual(7)
    expect(aI.weights.get(2)?.get(22)).toEqual(13)
    expect(aI.weights.get(2)?.get(21)).toEqual(8)
    expect(aI.weights.get(2)?.get(201)).toEqual(8)
    expect(aI.weights.get(0)?.get(2)).toEqual(10)
    expect(aI.weights.get(0)?.get(1)).toEqual(9)
    expect(aI.weights.get(0)?.get(10)).toEqual(9)
  })

  test('no weights below 0 at win / loss', () => {
    aI.weights.get(22222)?.set(222222, 0)
    aI.weights.get(2222)?.set(22222, 0)
    policy.setDiffs(-1, -1, -1)
    policy.applyPolicy(aI, history)
    expect(aI.weights.get(22222)?.get(222222)).toEqual(0) // <--- remains unchanged
    expect(aI.weights.get(22222)?.get(222221)).toEqual(4)
    expect(aI.weights.get(22222)?.get(2222201)).toEqual(4)
    expect(aI.weights.get(2222)?.get(22222)).toEqual(0) // <--- remains unchanged
    expect(aI.weights.get(2222)?.get(22221)).toEqual(5)
    expect(aI.weights.get(2222)?.get(222201)).toEqual(5)
    expect(aI.weights.get(222)?.get(2222)).toEqual(5)
    expect(aI.weights.get(222)?.get(2221)).toEqual(6)
    expect(aI.weights.get(222)?.get(22201)).toEqual(6)
    expect(aI.weights.get(22)?.get(222)).toEqual(6)
    expect(aI.weights.get(22)?.get(221)).toEqual(7)
    expect(aI.weights.get(22)?.get(2201)).toEqual(7)
    expect(aI.weights.get(2)?.get(22)).toEqual(7)
    expect(aI.weights.get(2)?.get(21)).toEqual(8)
    expect(aI.weights.get(2)?.get(201)).toEqual(8)
    expect(aI.weights.get(0)?.get(2)).toEqual(8)
    expect(aI.weights.get(0)?.get(1)).toEqual(9)
    expect(aI.weights.get(0)?.get(10)).toEqual(9)
  })

  test('no weights below 0 at draw', () => {
    handler.winner.value = drawStatus
    aI.weights.get(22222)?.set(222222, 0)
    aI.weights.get(2222)?.set(22222, 0)
    policy.setDiffs(-1, -1, -1)
    policy.applyPolicy(aI, history)
    expect(aI.weights.get(22222)?.get(222222)).toEqual(0) // <--- remains unchanged
    expect(aI.weights.get(22222)?.get(222221)).toEqual(4)
    expect(aI.weights.get(22222)?.get(2222201)).toEqual(4)
    expect(aI.weights.get(2222)?.get(22222)).toEqual(0) // <--- remains unchanged
    expect(aI.weights.get(2222)?.get(22221)).toEqual(5)
    expect(aI.weights.get(2222)?.get(222201)).toEqual(5)
    expect(aI.weights.get(222)?.get(2222)).toEqual(5)
    expect(aI.weights.get(222)?.get(2221)).toEqual(6)
    expect(aI.weights.get(222)?.get(22201)).toEqual(6)
    expect(aI.weights.get(22)?.get(222)).toEqual(6)
    expect(aI.weights.get(22)?.get(221)).toEqual(7)
    expect(aI.weights.get(22)?.get(2201)).toEqual(7)
    expect(aI.weights.get(2)?.get(22)).toEqual(7)
    expect(aI.weights.get(2)?.get(21)).toEqual(8)
    expect(aI.weights.get(2)?.get(201)).toEqual(8)
    expect(aI.weights.get(0)?.get(2)).toEqual(8)
    expect(aI.weights.get(0)?.get(1)).toEqual(9)
    expect(aI.weights.get(0)?.get(10)).toEqual(9)
  })
})

function beforeSetupRealisticExample() {
  weights.set(
    0,
    new Map([
      [1, policy.getInitialWeight(0)],
      [10, policy.getInitialWeight(0)],
      [10000, policy.getInitialWeight(0)]
    ])
  )
  weights.set(10, new Map([[12, policy.getInitialWeight(1)]]))
  weights.set(
    12,
    new Map([
      [10012, policy.getInitialWeight(2)],
      [122, policy.getInitialWeight(2)]
    ])
  )
  weights.set(
    10012,
    new Map([
      [12210, policy.getInitialWeight(3)],
      [112200, policy.getInitialWeight(3)]
    ])
  )
  weights.set(
    12210,
    new Map([
      [2111020, policy.getInitialWeight(4)],
      [12211, policy.getInitialWeight(4)]
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
      [2, policy.getInitialWeight(0)],
      [1, policy.getInitialWeight(0)],
      [10, policy.getInitialWeight(0)]
    ])
  )
  weights.set(
    2,
    new Map([
      [22, policy.getInitialWeight(1)],
      [21, policy.getInitialWeight(1)],
      [201, policy.getInitialWeight(1)]
    ])
  )
  weights.set(
    22,
    new Map([
      [222, policy.getInitialWeight(2)],
      [221, policy.getInitialWeight(2)],
      [2201, policy.getInitialWeight(2)]
    ])
  )
  weights.set(
    222,
    new Map([
      [2222, policy.getInitialWeight(3)],
      [2221, policy.getInitialWeight(3)],
      [22201, policy.getInitialWeight(3)]
    ])
  )
  weights.set(
    2222,
    new Map([
      [22222, policy.getInitialWeight(4)],
      [22221, policy.getInitialWeight(4)],
      [222201, policy.getInitialWeight(4)]
    ])
  )
  weights.set(
    22222,
    new Map([
      [222222, policy.getInitialWeight(5)],
      [222221, policy.getInitialWeight(5)],
      [2222201, policy.getInitialWeight(5)]
    ])
  )
  aI.weights = weights
  handler.winner.value = 2
  handler.getGBHandler().gameBoard.value = history[history.length - 1]
}
