import { AIPlayer } from '@/logic/AIPlayer'
import type { GameBoardHandler } from '@/logic/GameBoardHandler'
import { GameHandler } from '@/logic/GameHandler'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { debugRandomizerFactory, resetGameHandler } from './TestUtil'
import { GameSettings } from '@/logic/GameSettings'
import { UserPlayer } from '@/logic/UserPlayer'
import { EliminationPolicy } from '@/logic/EliminationPolicy'
import { player1Name, player2Name } from '@/utils/ActivePlayerExport'
vi.mock('@/utils/GraphExport', () => {
  return {
    updateHistory: vi.fn(),
    initializeHistory: vi.fn(),
    resetHistory: vi.fn()
  }
})
let gameHandler: GameHandler
let gBHandler: GameBoardHandler
let settings: GameSettings

beforeEach(() => {
  resetGameHandler()
  gameHandler = GameHandler.getInstance()
  gBHandler = gameHandler.getGBHandler()
  settings = gameHandler.settings
  //Remove randomization
  const ai: AIPlayer = gameHandler.settings.player2 as AIPlayer
  const randomizer = debugRandomizerFactory()
  randomizer.setRandomNumber(1)
  ai.randomizer = randomizer
})

describe('getPlayer', () => {
  test('getPlayer', () => {
    expect(settings.getPlayer(1)).toEqual(settings.player1)
    expect(settings.getPlayer(2)).toEqual(settings.player2)
  })
})

describe('User input is only used if userplayer is on turn', () => {
  test('UserPlayer as player1, AIPlayer as player2', () => {
    gameHandler.performTurnFromUserInput(0, 0)
    expect(gBHandler.getGameBoard().getCode()).toEqual(1)
    gameHandler.performTurnFromUserInput(0, 1)
    expect(gBHandler.getGameBoard().getCode()).toEqual(1)
  })
})

describe('AI will only play if it is on turn', () => {
  test('UserPlayer as player1, AIPlayer as player2', () => {
    //it's the user's turn, ai may not move
    gameHandler.performAiTurn()
    expect(gBHandler.getGameBoard().getCode()).toEqual(0)
    //simulate user turn
    gameHandler.performTurnFromUserInput(0, 0)
    //now ai may move
    gameHandler.performAiTurn()
    expect(gBHandler.getGameBoard().getCode()).toEqual(21)
    //ai tries to move again, but can't
    gameHandler.performAiTurn()
    expect(gBHandler.getGameBoard().getCode()).toEqual(21)
  })
})

describe('Player name export', () => {
  test('player1Name', () => {
    settings.setPlayers(new AIPlayer(new EliminationPolicy(), 'myAI'), new UserPlayer('myUser'))
    expect(player1Name.value).toEqual('myAI')
    expect(player2Name.value).toEqual('myUser')
  })
})
