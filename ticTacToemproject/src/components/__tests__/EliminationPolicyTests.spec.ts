import { AIPlayer } from '@/logic/AIPlayer'
import { EliminationPolicy } from '@/logic/EliminationPolicy'
import { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import { drawStatus } from '@/logic/WinnerStatus'
import { beforeEach, describe, expect, test } from 'vitest'
import { ref } from 'vue'

const handler = GameHandler.getInstance()
const settings = handler.getSettings()
const weights = new Map([[0, new Map([[1, 1], [10, 1], [10000, 1]])]])

let policy: EliminationPolicy
let aI: AIPlayer
let history: GameBoard[]

beforeEach(() => {
  policy = new EliminationPolicy()
  aI = new AIPlayer(policy)
  settings.player1 = new AIPlayer(policy)
  settings.player2 = aI
  history = [new GameBoard(), new GameBoard([[1, 0, 0], [0, 0, 0], [0, 0, 0]])]
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
    handler.winner = ref(null)
    aI.weights = weights
    policy.applyPolicy(aI, history)
    expect(aI.weights).toEqual(0)
  })

  test('should not change weights if game results in draw', () => {
    handler.winner = ref(drawStatus)
    const weights = new Map([[0, new Map([[1, 1], [10, 1], [10000, 1]])]])
    aI.weights = weights
    policy.applyPolicy(aI, history)
    expect(aI.weights).toEqual(weights)
  })

  test('should not change weights if AI won', () => {
    handler.winner = ref(2)
    const weights = new Map([[0, new Map([[1, 1], [10, 1], [10000, 1]])]])
    aI.weights = weights
    policy.applyPolicy(aI, history)
    expect(aI.weights).toEqual(weights)
  })

  test('should set weights of last move to 0 if AI did not win', () => {
    handler.winner = ref(2)
    const weights = new Map([[0, new Map([[1, 1], [10, 1], [10000, 1]])]])
    aI.weights = weights
    policy.applyPolicy(aI, history)
    expect(aI.weights.get(0)?.get(10000)).toEqual(0)
  })
})
