import { AIPlayer } from '@/logic/AIPlayer'
import { BackpropagationPolicy } from '@/logic/BackpropagationPolicy'
import { EliminationPolicy } from '@/logic/EliminationPolicy'
import { GameBoard, getGameBoardFromCode } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import type { GameSettings } from '@/logic/GameSettings'
import { UserPlayer } from '@/logic/UserPlayer'
import { graphExport } from '@/utils/GraphExport'
import { labelExport, updateLabels } from '@/utils/LabelExport'
import { beforeEach, describe, expect, test } from 'vitest'

const settings: GameSettings = GameHandler.getInstance().getSettings()
let aI: AIPlayer

describe('updateLabel', () => {
  beforeEach(() => {
    aI = new AIPlayer(new BackpropagationPolicy())
    aI.weights.set(
      0,
      new Map<number, number>([
        [1, aI.policy.getInitialWeight(0)],
        [10, aI.policy.getInitialWeight(0)],
        [10000, aI.policy.getInitialWeight(0)]
      ])
    )
    aI.weights.set(
      1,
      new Map<number, number>([
        [21, aI.policy.getInitialWeight(1)],
        [102, aI.policy.getInitialWeight(1)]
      ])
    )
    graphExport.value.edges = {}
    graphExport.value.edges['0#1'] = { source: '0', target: '1' }
    graphExport.value.edges['0#10'] = { source: '0', target: '10' }
    graphExport.value.edges['0#10000'] = { source: '0', target: '10000' }
    graphExport.value.edges['1#21'] = { source: '1', target: '21' }
    graphExport.value.edges['1#102'] = { source: '1', target: '102' }
  })
  test('first Player is AI', () => {
    settings.setPlayers(aI, new UserPlayer())
    updateLabels()
    expect(labelExport.value['0#1']).toEqual(['8', ''])
    expect(labelExport.value['0#10']).toEqual(['8', ''])
    expect(labelExport.value['0#10000']).toEqual(['8', ''])
    expect(labelExport.value['1#21']).toEqual(['7', ''])
    expect(labelExport.value['1#102']).toEqual(['7', ''])
  })

  test('second Player is AI', () => {
    settings.setPlayers(new UserPlayer(), aI)
    updateLabels()
    expect(labelExport.value['0#1']).toEqual(['', '8'])
    expect(labelExport.value['0#10']).toEqual(['', '8'])
    expect(labelExport.value['0#10000']).toEqual(['', '8'])
    expect(labelExport.value['1#21']).toEqual(['', '7'])
    expect(labelExport.value['1#102']).toEqual(['', '7'])
  })

  test('both Players are AI', () => {
    settings.setPlayers(aI, new AIPlayer(new EliminationPolicy()))
    updateLabels()
    expect(labelExport.value['0#1']).toEqual(['8', '1'])
    expect(labelExport.value['0#10']).toEqual(['8', '1'])
    expect(labelExport.value['0#10000']).toEqual(['8', '1'])
    expect(labelExport.value['1#21']).toEqual(['7', '1'])
    expect(labelExport.value['1#102']).toEqual(['7', '1'])
  })

  test('both Players are human', () => {
    settings.setPlayers(new UserPlayer(), new UserPlayer())
    updateLabels()
    expect(labelExport.value['0#1']).toEqual(['', ''])
    expect(labelExport.value['0#10']).toEqual(['', ''])
    expect(labelExport.value['0#10000']).toEqual(['', ''])
    expect(labelExport.value['1#21']).toEqual(['', ''])
    expect(labelExport.value['1#102']).toEqual(['', ''])
  })
})

describe('getGameBoardFromCode', () => {
  test('standard Codes', () => {
    expect(getGameBoardFromCode(0)).toEqual(
      new GameBoard([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(getGameBoardFromCode(1)).toEqual(
      new GameBoard([
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(getGameBoardFromCode(10)).toEqual(
      new GameBoard([
        [0, 1, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(getGameBoardFromCode(100)).toEqual(
      new GameBoard([
        [0, 0, 1],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(getGameBoardFromCode(10000)).toEqual(
      new GameBoard([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ])
    )
    expect(getGameBoardFromCode(21)).toEqual(
      new GameBoard([
        [1, 2, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(getGameBoardFromCode(102)).toEqual(
      new GameBoard([
        [2, 0, 1],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(getGameBoardFromCode(112212121)).toEqual(
      new GameBoard([
        [1, 2, 1],
        [2, 1, 2],
        [2, 1, 1]
      ])
    )
  })

  test('custom codes', () => {
    expect(getGameBoardFromCode(2)).toEqual(
      new GameBoard([
        [2, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(getGameBoardFromCode(22)).toEqual(
      new GameBoard([
        [2, 2, 0],
        [0, 0, 0],
        [0, 0, 0]
      ])
    )
    expect(getGameBoardFromCode(222222222)).toEqual(
      new GameBoard([
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2]
      ])
    )
  })

  test('invalid codes', () => {
    expect(() => getGameBoardFromCode(3)).toThrowError()
    expect(() => getGameBoardFromCode(1111111111)).toThrowError()
  })
})


