import { AIPlayer } from '@/logic/AIPlayer'
import { EliminationPolicy } from '@/logic/EliminationPolicy'
import { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import { drawStatus } from '@/logic/WinnerStatus'
import { beforeEach, describe, expect, test } from 'vitest'

const handler = GameHandler.getInstance()
const weights = new Map()

let policy: EliminationPolicy
let aI: AIPlayer
let history: GameBoard[]

beforeEach(() => {
  policy = new EliminationPolicy()
  aI = new AIPlayer(policy)
})

describe('getInitialWeight', () => {
  test('should always return 1', () => {
    expect(policy.getInitialWeight(0)).toEqual(1)
    expect(policy.getInitialWeight(-1)).toEqual(1)
    expect(policy.getInitialWeight(50)).toEqual(1)
  })
})

describe('applyPolicy with realistic examples', () => {
  beforeEach(() => {
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
  })
  test('should not change weights if game is not over', () => {
    handler.winner.value = null
    policy.applyPolicy(aI, history)
    expect(aI.weights).toEqual(weights)
  })

  test('should not change weights if game results in draw', () => {
    handler.winner.value = drawStatus
    policy.applyPolicy(aI, history)
    expect(aI.weights).toEqual(weights)
  })

  test('should set weights of last move to 0 if AI won', () => {
    handler.winner.value = 2
    policy.applyPolicy(aI, history)
    expect(
      aI.weights
        .get(history[history.length - 3].getNormalForm())
        ?.get(history[history.length - 2].getNormalForm())
    ).toEqual(0)
  })

  test('should set weights of last move to 0 if AI did not win', () => {
    handler.winner.value = 1
    policy.applyPolicy(aI, history)
    expect(
      aI.weights
        .get(history[history.length - 3].getNormalForm())
        ?.get(history[history.length - 2].getNormalForm())
    ).toEqual(0)
    expect(
      aI.weights
        .get(history[history.length - 5].getNormalForm())
        ?.get(history[history.length - 4].getNormalForm())
    ).toEqual(1)
  })

  test('should set weights of last and second to last move to 0 if AI did not win', () => {
    weights.get(10012)?.set(112200, 0)
    handler.winner.value = 1
    policy.applyPolicy(aI, history)
    expect(
      aI.weights
        .get(history[history.length - 3].getNormalForm())
        ?.get(history[history.length - 2].getNormalForm())
    ).toEqual(0)
    expect(
      aI.weights
        .get(history[history.length - 5].getNormalForm())
        ?.get(history[history.length - 4].getNormalForm())
    ).toEqual(0)
  })
})

describe('apply Policy with unrealistic examples', () => {
  beforeEach(() => {
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
  })
  test('standard loss, expect only one weight change', () => {
    policy.applyPolicy(aI, history)
    expect(aI.weights.get(2222)?.get(22222)).toEqual(0)
    expect(aI.weights.get(2222)?.get(22221)).toEqual(1)
    expect(aI.weights.get(2222)?.get(222201)).toEqual(1)
    expect(aI.weights.get(222)?.get(2222)).toEqual(1)
    expect(aI.weights.get(222)?.get(2221)).toEqual(1)
    expect(aI.weights.get(222)?.get(22201)).toEqual(1)
    expect(aI.weights.get(22)?.get(222)).toEqual(1)
    expect(aI.weights.get(22)?.get(221)).toEqual(1)
    expect(aI.weights.get(22)?.get(2201)).toEqual(1)
  })

  test('loss, expect two weights to change', () => {
    aI.weights.get(2222)?.set(22221, 0)
    aI.weights.get(2222)?.set(222201, 0)
    policy.applyPolicy(aI, history)
    expect(aI.weights.get(2222)?.get(22222)).toEqual(0)
    expect(aI.weights.get(2222)?.get(22221)).toEqual(0)
    expect(aI.weights.get(2222)?.get(222201)).toEqual(0)
    expect(aI.weights.get(222)?.get(2222)).toEqual(1)
    expect(aI.weights.get(222)?.get(2221)).toEqual(1)
    expect(aI.weights.get(222)?.get(22201)).toEqual(1)
    expect(aI.weights.get(22)?.get(222)).toEqual(0) //<--this changed, too
    expect(aI.weights.get(22)?.get(221)).toEqual(1)
    expect(aI.weights.get(22)?.get(2201)).toEqual(1)
  })

  test('loss, expect two weights to change ', () => {
    aI.weights.get(222)?.set(2222, 0)
    aI.weights.get(222)?.set(2221, 0)
    aI.weights.get(222)?.set(22201, 0)
    policy.applyPolicy(aI, history)
    expect(aI.weights.get(2222)?.get(22222)).toEqual(0)
    expect(aI.weights.get(2222)?.get(22221)).toEqual(1)
    expect(aI.weights.get(2222)?.get(222201)).toEqual(1)
    expect(aI.weights.get(222)?.get(2222)).toEqual(0)
    expect(aI.weights.get(222)?.get(2221)).toEqual(0)
    expect(aI.weights.get(222)?.get(22201)).toEqual(0)
    expect(aI.weights.get(22)?.get(222)).toEqual(1)
    expect(aI.weights.get(22)?.get(221)).toEqual(1)
    expect(aI.weights.get(22)?.get(2201)).toEqual(1)
    expect(aI.weights.get(2)?.get(22)).toEqual(0) //<--this changed, too
    expect(aI.weights.get(2)?.get(21)).toEqual(1)
    expect(aI.weights.get(2)?.get(201)).toEqual(1)
  })
})
