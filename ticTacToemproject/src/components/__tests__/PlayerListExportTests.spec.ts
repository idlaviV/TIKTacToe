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
      { player: 'Mensch', index: 0 },
      { player: 'KI-Elimination', index: 1 },
      { player: 'KI-Fehlerrückführung', index: 2 },
      { player: 'KI-Elimination v2.0', index: 3 }
    ])
  })
  test('No AIs', () => {
    GameHandler.getInstance().possiblePlayers = [GameHandler.getInstance().humanPlayer]
    updatePlayerList()
    expect(players.value).toEqual([{ player: 'Mensch', index: 0 }])
  })
  test('addition of one AI', () => {
    GameHandler.getInstance().destroySingleton()
    GameHandler.getInstance().createAI(1, 'myAI')
    expect(players.value).toEqual([
      { player: 'Mensch', index: 0 },
      { player: 'KI-Elimination', index: 1 },
      { player: 'KI-Fehlerrückführung', index: 2 },
      { player: 'KI-Elimination v2.0', index: 3 },
      { player: 'myAI', index: 4 }
    ])
  })
})
