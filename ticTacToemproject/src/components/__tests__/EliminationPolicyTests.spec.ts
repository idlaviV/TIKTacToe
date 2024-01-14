import { AIPlayer } from '@/logic/AIPlayer'
import { EliminationPolicy } from '@/logic/EliminationPolicy'
import { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import { drawStatus } from '@/logic/WinnerStatus'
import { beforeEach, describe, expect, test } from 'vitest'

const handler = GameHandler.getInstance()
const settings = handler.settings
const weights = new Map()
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

let policy: EliminationPolicy
let aI: AIPlayer
let history: GameBoard[]

beforeEach(() => {
  policy = new EliminationPolicy()
  aI = new AIPlayer(policy)
  settings.player1 = new AIPlayer(policy)
  settings.player2 = aI
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

describe('getInitialWeight', () => {
  test('should always return 1', () => {
    expect(policy.getInitialWeight(0)).toEqual(1)
    expect(policy.getInitialWeight(-1)).toEqual(1)
    expect(policy.getInitialWeight(50)).toEqual(1)
  })
})

describe('applyPolicy', () => {
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

  test('should not change weights if AI won', () => {
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
