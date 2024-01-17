import { GameHandler } from '@/logic/GameHandler'
import { players, updatePlayerList } from '@/utils/PlayerListExport'
import { beforeEach } from 'node:test'
import { describe, expect, test } from 'vitest'

beforeEach(() => {
  GameHandler.getInstance().destroySingleton()
})

describe('PlayerListExport', () => {
  test('Standard case', () => {
    updatePlayerList()
    expect(players.value).toEqual([
      { player: 'Human', index: 0 },
      { player: 'AI', index: 1 },
      { player: 'AI2', index: 2 }
    ])
  })
  test('No AIs', () => {
    GameHandler.getInstance().possiblePlayers = [GameHandler.getInstance().humanPlayer]
    updatePlayerList()
    expect(players.value).toEqual([{ player: 'Human', index: 0 }])
  })
  test('addition of one AI', () => {
    GameHandler.getInstance().destroySingleton()
    GameHandler.getInstance().createAI(0, 'myAI')
    expect(players.value).toEqual([
      { player: 'Human', index: 0 },
      { player: 'AI', index: 1 },
      { player: 'AI2', index: 2 },
      { player: 'myAI', index: 3 }
    ])
  })
})
