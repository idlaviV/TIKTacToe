import { GameHandler } from '@/logic/GameHandler'
import { players, updatePlayerList } from '@/utils/PlayerListExport'
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
    const aIList = players.value
    expect(aIList.length).toEqual(3)
    expect(aIList.find((entry) => entry.player === 'Mensch')?.index).toEqual(0)
    expect(aIList.find((entry) => entry.player === 'KI')).not.toEqual(undefined)
    expect(aIList.find((entry) => entry.player === 'KI 2')).not.toEqual(undefined)
  })
  test('no AIs', () => {
    gameHandler.possiblePlayers = []
    updatePlayerList()
    const aIList = players.value
    expect(aIList.length).toEqual(0)
  })
})
