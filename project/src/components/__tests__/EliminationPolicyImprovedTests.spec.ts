import { AIPlayer } from '@/logic/AIPlayer'
import { EliminationPolicyImproved } from '@/logic/EliminationPolicyImproved'
import { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import { drawStatus } from '@/logic/WinnerStatus'
import { beforeEach, describe, expect, test } from 'vitest'
import { getWeightClone } from './TestUtil'
import { nextGuiState } from '@/logic/GuiState'

let handler = GameHandler.getInstance()
const weights = new Map()

let policy: EliminationPolicyImproved
let aI: AIPlayer
let history: GameBoard[]

beforeEach(() => {
  policy = new EliminationPolicyImproved()
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
  beforeEach(beforeSetUpRealisticExample)
  test('should not change weights if game is not over', () => {
    handler.winner.value = null

    const oldWeights = getWeightClone(aI.weights)

    policy.applyPolicy(aI, history)
    expect(aI.weights).toEqual(oldWeights)
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

describe('apply Policy with artificial examples', () => {
  beforeEach(beforeSetupArtificialExample)
  test('standard loss, expect only one weight change', () => {
    policy.applyPolicy(aI, history)
    expect(aI.weights.get(22222)?.get(222222)).toEqual(1) //<--Win move
    expect(aI.weights.get(22222)?.get(222221)).toEqual(0) //<-alternatives to win move
    expect(aI.weights.get(22222)?.get(2222201)).toEqual(0) //<-alternatives to win move
    expect(aI.weights.get(2222)?.get(22222)).toEqual(0) //<-loss move
    expect(aI.weights.get(2222)?.get(22221)).toEqual(1)
    expect(aI.weights.get(2222)?.get(222201)).toEqual(1)
    expect(aI.weights.get(222)?.get(2222)).toEqual(1)
    expect(aI.weights.get(222)?.get(2221)).toEqual(1)
    expect(aI.weights.get(222)?.get(22201)).toEqual(1)
    expect(aI.weights.get(22)?.get(222)).toEqual(1)
    expect(aI.weights.get(22)?.get(221)).toEqual(1)
    expect(aI.weights.get(22)?.get(2201)).toEqual(1)
  })

  test('draw, expect no changes', () => {
    handler.winner.value = drawStatus
    policy.applyPolicy(aI, history)
    expect(aI.weights.get(22222)?.get(222222)).toEqual(1)
    expect(aI.weights.get(22222)?.get(222221)).toEqual(1)
    expect(aI.weights.get(22222)?.get(2222201)).toEqual(1)
    expect(aI.weights.get(2222)?.get(22222)).toEqual(1)
    expect(aI.weights.get(2222)?.get(22221)).toEqual(1)
    expect(aI.weights.get(2222)?.get(222201)).toEqual(1)
    expect(aI.weights.get(222)?.get(2222)).toEqual(1)
    expect(aI.weights.get(222)?.get(2221)).toEqual(1)
    expect(aI.weights.get(222)?.get(22201)).toEqual(1)
    expect(aI.weights.get(22)?.get(222)).toEqual(1)
    expect(aI.weights.get(22)?.get(221)).toEqual(1)
    expect(aI.weights.get(22)?.get(2201)).toEqual(1)
  })

  test('draw, but there is a loss-move, which gets eliminated', () => {
    aI.weights.get(22222)?.set(222222, 0)
    aI.weights.get(22222)?.set(222221, 0)
    aI.weights.get(22222)?.set(2222201, 0)
    handler.winner.value = drawStatus
    policy.applyPolicy(aI, history)
    expect(aI.weights.get(2222)?.get(22222)).toEqual(1) //<- winning move
    expect(aI.weights.get(2222)?.get(22221)).toEqual(0) //<- alternative to winning move
    expect(aI.weights.get(2222)?.get(222201)).toEqual(0) //<- alternative to winning move
    expect(aI.weights.get(222)?.get(2222)).toEqual(0) //<- loss move
    expect(aI.weights.get(222)?.get(2221)).toEqual(1)
    expect(aI.weights.get(222)?.get(22201)).toEqual(1)
    expect(aI.weights.get(22)?.get(222)).toEqual(1)
    expect(aI.weights.get(22)?.get(221)).toEqual(1)
    expect(aI.weights.get(22)?.get(2201)).toEqual(1)
  })

  test('loss, one losing move discovered, which triggers another losing move', () => {
    aI.weights.get(2222)?.set(22221, 0)
    aI.weights.get(2222)?.set(222201, 0)
    policy.applyPolicy(aI, history)
    expect(aI.weights.get(2222)?.get(22222)).toEqual(0)
    expect(aI.weights.get(2222)?.get(22221)).toEqual(0)
    expect(aI.weights.get(2222)?.get(222201)).toEqual(0)
    expect(aI.weights.get(222)?.get(2222)).toEqual(1) //<- winning move
    expect(aI.weights.get(222)?.get(2221)).toEqual(0)
    expect(aI.weights.get(222)?.get(22201)).toEqual(0)
    expect(aI.weights.get(22)?.get(222)).toEqual(0) //<--this changed, too
    expect(aI.weights.get(22)?.get(221)).toEqual(1)
    expect(aI.weights.get(22)?.get(2201)).toEqual(1)
    expect(aI.weights.get(2)?.get(22)).toEqual(1) // this is not a winning move yet, as 22->221 can still be played
    expect(aI.weights.get(2)?.get(21)).toEqual(1)
    expect(aI.weights.get(2)?.get(201)).toEqual(1)
  })

  test('loss, one losing move discovered, but the previous losing move was already known', () => {
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
    expect(aI.weights.get(22)?.get(222)).toEqual(1) //<-winning move
    expect(aI.weights.get(22)?.get(221)).toEqual(0)
    expect(aI.weights.get(22)?.get(2201)).toEqual(0)
    expect(aI.weights.get(2)?.get(22)).toEqual(0) //<--this changed, too
    expect(aI.weights.get(2)?.get(21)).toEqual(1)
    expect(aI.weights.get(2)?.get(201)).toEqual(1)
  })

  test('loss position does not trigger win-move-elimination, because it already was marked as losing', () => {
    aI.weights.get(2222)?.set(22221, 0)
    aI.weights.get(2222)?.set(222201, 0)
    aI.weights.get(222)?.set(2222, 0)
    aI.weights.get(222)?.set(2221, 0) //established 222->22201 as winning move
    policy.applyPolicy(aI, history)
    expect(aI.weights.get(22222)?.get(222222)).toEqual(1) //winning move
    expect(aI.weights.get(22222)?.get(222221)).toEqual(0) //alternative to last winning move
    expect(aI.weights.get(22222)?.get(2222201)).toEqual(0) //alternative to last winning move
    expect(aI.weights.get(2222)?.get(22222)).toEqual(0) //Losing move
    expect(aI.weights.get(2222)?.get(22221)).toEqual(0)
    expect(aI.weights.get(2222)?.get(222201)).toEqual(0)
    expect(aI.weights.get(222)?.get(2222)).toEqual(0) // This is still an alternative to a win move
    expect(aI.weights.get(222)?.get(2221)).toEqual(0) // This is still an alternative to a win move
    expect(aI.weights.get(222)?.get(22201)).toEqual(1) //This is still a winning move
    expect(aI.weights.get(22)?.get(222)).toEqual(0)
    expect(aI.weights.get(22)?.get(221)).toEqual(1)
    expect(aI.weights.get(22)?.get(2201)).toEqual(1)
  })

  test('loss, which eliminates a weight in rank 0', () => {
    aI.weights.get(22)?.set(222, 0)
    aI.weights.get(22)?.set(221, 0)
    aI.weights.get(22)?.set(2201, 0)
    policy.applyPolicy(aI, history)
    expect(aI.weights.get(2222)?.get(22222)).toEqual(0)
    expect(aI.weights.get(2222)?.get(22221)).toEqual(1)
    expect(aI.weights.get(2222)?.get(222201)).toEqual(1)
    expect(aI.weights.get(222)?.get(2222)).toEqual(1)
    expect(aI.weights.get(222)?.get(2221)).toEqual(1)
    expect(aI.weights.get(222)?.get(22201)).toEqual(1)
    expect(aI.weights.get(22)?.get(222)).toEqual(0)
    expect(aI.weights.get(22)?.get(221)).toEqual(0)
    expect(aI.weights.get(22)?.get(2201)).toEqual(0)
    expect(aI.weights.get(2)?.get(22)).toEqual(1) //Winning move
    expect(aI.weights.get(2)?.get(21)).toEqual(0)
    expect(aI.weights.get(2)?.get(201)).toEqual(0)
    expect(aI.weights.get(0)?.get(2)).toEqual(0) //<--this changed, too
  })

  test('Win move triggers secondary win-move', () => {
    aI.weights.get(2222)?.set(22221,0)
    aI.weights.get(2222)?.set(222201,0)
    policy.applyPolicy(aI, history)
    expect(aI.weights.get(22222)?.get(222222)).toEqual(1) //<--Win move
    expect(aI.weights.get(22222)?.get(222221)).toEqual(0) //<-alternatives to win move
    expect(aI.weights.get(22222)?.get(2222201)).toEqual(0) //<-alternatives to win move
    expect(aI.weights.get(2222)?.get(22222)).toEqual(0) //<-loss move
    expect(aI.weights.get(2222)?.get(22221)).toEqual(0) //already 0
    expect(aI.weights.get(2222)?.get(222201)).toEqual(0)//already 0
    expect(aI.weights.get(222)?.get(2222)).toEqual(1) //<-indirect winning move
    expect(aI.weights.get(222)?.get(2221)).toEqual(0) //alternatives to indirect winning move
    expect(aI.weights.get(222)?.get(22201)).toEqual(0) //alternatives to indirect winning move
    expect(aI.weights.get(22)?.get(222)).toEqual(0) //indirect loss move
    expect(aI.weights.get(22)?.get(221)).toEqual(1)
    expect(aI.weights.get(22)?.get(2201)).toEqual(1)
  })
})

describe('applyPolicy with integrated realistic examples', () => {
  beforeEach(beforeSetUpRealisticExample2)

  test('applyPolicies with gamehandler', () => {
    handler.performEndOfGameActions(true)
    const ai: AIPlayer = handler.getPossiblePlayers()[3] as AIPlayer
    expect(ai.weights.get(0)?.get(10000)).toEqual(1)
    const board7: GameBoard = new GameBoard([
      [2, 0, 0],
      [2, 1, 2],
      [1, 1, 1]
    ])
    const board6: GameBoard = new GameBoard([
      [2, 0, 0],
      [2, 1, 2],
      [0, 1, 1]
    ])
    const board5: GameBoard = new GameBoard([
      [2, 0, 0],
      [0, 1, 2],
      [0, 1, 1]
    ])
    expect(ai.weights.get(board6.getNormalForm())?.get(board7.getNormalForm())).toEqual(1)
    expect(ai.weights.get(board5.getNormalForm())?.get(board6.getNormalForm())).toEqual(0)
  })
})

function beforeSetUpRealisticExample() {
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

function beforeSetUpRealisticExample2() {
  GameHandler.getInstance().destroySingleton()
  handler = GameHandler.getInstance()
  handler.createAI(2, 'testAi')
  handler.setPlayers(3, 1)
  nextGuiState()
  handler.performTurn(1, 1)
  handler.performTurn(0, 0)
  handler.performTurn(2, 2)
  handler.performTurn(1, 2)
  handler.performTurn(2, 1)
  handler.performTurn(1, 0)
  handler.performTurn(2, 0)
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
