import { AIPlayer } from '@/logic/AIPlayer'
import { BackpropagationPolicy } from '@/logic/BackpropagationPolicy'
import { EliminationPolicy } from '@/logic/EliminationPolicy'
import { GameHandler } from '@/logic/GameHandler'
import type { GameSettings } from '@/logic/GameSettings'
import { UserPlayer } from '@/logic/UserPlayer'
import { graphExport } from '@/utils/GraphExport'
import { getLabelToShow, labelExport, updateLabels } from '@/utils/LabelExport'
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
    graphExport.value.edges['0#1'] = {
      source: '0',
      target: '1',
      id: '0#1',
      height: 0,
      numSource: 0,
      numTarget: 1
    }
    graphExport.value.edges['0#10'] = {
      source: '0',
      target: '10',
      id: '0#10',
      height: 0,
      numSource: 0,
      numTarget: 10
    }
    graphExport.value.edges['0#10000'] = {
      source: '0',
      target: '10000',
      id: '0#10000',
      height: 0,
      numSource: 0,
      numTarget: 10000
    }
    graphExport.value.edges['1#21'] = {
      source: '1',
      target: '21',
      id: '1#21',
      height: 1,
      numSource: 1,
      numTarget: 21
    }
    graphExport.value.edges['1#102'] = {
      source: '1',
      target: '102',
      id: '1#102',
      height: 1,
      numSource: 1,
      numTarget: 102
    }
    labelExport.value = {}
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

describe('getLabelToShow backpropagation ai as player One', () => {
  beforeEach(() => {
    labelExport.value['0#1'] = ['8', '']
    labelExport.value['0#10'] = ['8', '']
    labelExport.value['0#10000'] = ['8', '']
    labelExport.value['1#21'] = ['7', '']
    labelExport.value['1#102'] = ['7', '']
  })
  test('gameGraph', () => {
    expect(getLabelToShow('0#1', 'gameGraph')).toBe('8')
    expect(getLabelToShow('0#10', 'gameGraph')).toBe('8')
    expect(getLabelToShow('0#10000', 'gameGraph')).toBe('8')
    expect(getLabelToShow('1#21', 'gameGraph')).toBe('')
    expect(getLabelToShow('1#102', 'gameGraph')).toBe('')
  })
  test('player1Graph', () => {
    expect(getLabelToShow('0#1', 'player1Graph')).toBe('8')
    expect(getLabelToShow('0#10', 'player1Graph')).toBe('8')
    expect(getLabelToShow('0#10000', 'player1Graph')).toBe('8')
    expect(getLabelToShow('1#21', 'player1Graph')).toBe('7')
    expect(getLabelToShow('1#102', 'player1Graph')).toBe('7')
  })
  test('player2Graph', () => {
    expect(getLabelToShow('0#1', 'player2Graph')).toBe('')
    expect(getLabelToShow('0#10', 'player2Graph')).toBe('')
    expect(getLabelToShow('0#10000', 'player2Graph')).toBe('')
    expect(getLabelToShow('1#21', 'player2Graph')).toBe('')
    expect(getLabelToShow('1#102', 'player2Graph')).toBe('')
  })
  test('simpleGraph', () => {
    expect(getLabelToShow('0#1', 'simpleGraph')).toBe('')
    expect(getLabelToShow('0#10', 'simpleGraph')).toBe('')
    expect(getLabelToShow('0#10000', 'simpleGraph')).toBe('')
    expect(getLabelToShow('1#21', 'simpleGraph')).toBe('')
    expect(getLabelToShow('1#102', 'simpleGraph')).toBe('')
  })
})

describe('getLabelToShow elimination ai as player Two', () => {
  beforeEach(() => {
    labelExport.value['0#1'] = ['', '1']
    labelExport.value['0#10'] = ['', '1']
    labelExport.value['0#10000'] = ['', '1']
    labelExport.value['1#21'] = ['', '1']
    labelExport.value['1#102'] = ['', '1']
  })
  test('gameGraph', () => {
    expect(getLabelToShow('0#1', 'gameGraph')).toBe('')
    expect(getLabelToShow('0#10', 'gameGraph')).toBe('')
    expect(getLabelToShow('0#10000', 'gameGraph')).toBe('')
    expect(getLabelToShow('1#21', 'gameGraph')).toBe('1')
    expect(getLabelToShow('1#102', 'gameGraph')).toBe('1')
  })
  test('player1Graph', () => {
    expect(getLabelToShow('0#1', 'player1Graph')).toBe('')
    expect(getLabelToShow('0#10', 'player1Graph')).toBe('')
    expect(getLabelToShow('0#10000', 'player1Graph')).toBe('')
    expect(getLabelToShow('1#21', 'player1Graph')).toBe('')
    expect(getLabelToShow('1#102', 'player1Graph')).toBe('')
  })
  test('player2Graph', () => {
    expect(getLabelToShow('0#1', 'player2Graph')).toBe('1')
    expect(getLabelToShow('0#10', 'player2Graph')).toBe('1')
    expect(getLabelToShow('0#10000', 'player2Graph')).toBe('1')
    expect(getLabelToShow('1#21', 'player2Graph')).toBe('1')
    expect(getLabelToShow('1#102', 'player2Graph')).toBe('1')
  })
  test('simpleGraph', () => {
    expect(getLabelToShow('0#1', 'simpleGraph')).toBe('')
    expect(getLabelToShow('0#10', 'simpleGraph')).toBe('')
    expect(getLabelToShow('0#10000', 'simpleGraph')).toBe('')
    expect(getLabelToShow('1#21', 'simpleGraph')).toBe('')
    expect(getLabelToShow('1#102', 'simpleGraph')).toBe('')
  })
})
