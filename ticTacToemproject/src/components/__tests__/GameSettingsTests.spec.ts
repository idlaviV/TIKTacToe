import { AIPlayer } from '@/logic/AIPlayer'
import type { GameBoardHandler } from '@/logic/GameBoardHandler'
import { GameHandler } from '@/logic/GameHandler'
import { beforeEach, describe, expect, test } from 'vitest'
let gameHandler: GameHandler
let gBHandler: GameBoardHandler

beforeEach(() => {
  //Later: Setup should set AI on slot 2, UserPlayer on slot 1
  gameHandler = new GameHandler()
  gBHandler = gameHandler.getGBHandler()
  //Remove randomization
  const ai: AIPlayer = gameHandler.settings.player2 as AIPlayer
  ai.randomzier = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    randomInteger(min: number, max: number) {
      return 1
    }
  }
})

describe('User input is only used if userplayer is on turn', () => {
  test('UserPlayer as player1, AIPlayer as player2', () => {
    gameHandler.performTurnFromUserInput(0, 0)
    expect(gBHandler.getGameBoard().getCode()).toEqual(1)
    gameHandler.performTurnFromUserInput(0, 0)
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
