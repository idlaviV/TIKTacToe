import { GameHandler } from '@/logic/GameHandler'
import { Players, updatePlayerList } from '@/utils/PlayerListExport'
import { beforeEach } from 'node:test'
import { expect, test, describe } from 'vitest'

let gameHandler: GameHandler = GameHandler.getInstance()

beforeEach(() => {
  GameHandler.getInstance().destroySingleton()
  gameHandler = GameHandler.getInstance()
})

describe('updateAIList', () => {
  test('generic input', () => {
    updatePlayerList()
    const aIList = Players.value
    expect(aIList.length).toEqual(3)
    expect(aIList.find((entry) => entry.player === 'Human')?.index).toEqual(0)
    expect(aIList.find((entry) => entry.player === 'AI')).not.toEqual(undefined)
    expect(aIList.find((entry) => entry.player === 'AI2')).not.toEqual(undefined)
  })
  test('no AIs', () => {
    gameHandler.possiblePlayers = []
    updatePlayerList()
    const aIList = Players.value
    expect(aIList.length).toEqual(0)
  })
})
