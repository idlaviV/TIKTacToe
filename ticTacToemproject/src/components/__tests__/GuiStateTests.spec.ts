import { GameHandler } from '@/logic/GameHandler'
import { resetGameHandler } from './TestUtil'
import { expect, beforeEach, describe, test } from 'vitest'
import {
  getGuiState,
  nextGuiState,
  setGuiState,
  skipEvaluationScreen,
  skipStartScreen
} from '@/logic/GuiState'
import { resetHistory } from '@/utils/GraphExport'

beforeEach(() => {
  GameHandler.getInstance()
  resetGameHandler()
  resetGuiState()
  resetHistory()
})

describe('nextGuiState with AIs', () => {
  test('no skips', () => {
    expect(getGuiState().value).toEqual('start')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
    nextGuiState()
    expect(getGuiState().value).toEqual('evaluation')
    nextGuiState()
    expect(getGuiState().value).toEqual('postevaluation')
    nextGuiState()
    expect(getGuiState().value).toEqual('start')
  })
  test('no skips, but simulate "Überspringen"-click, so postevaluation is skipped once', () => {
    expect(getGuiState().value).toEqual('start')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
    nextGuiState()
    expect(getGuiState().value).toEqual('evaluation')
    nextGuiState(true)
    expect(getGuiState().value).toEqual('start')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
    nextGuiState()
    expect(getGuiState().value).toEqual('evaluation')
    nextGuiState()
    expect(getGuiState().value).toEqual('postevaluation')
  })
  test('skip start', () => {
    skipStartScreen.value = true
    expect(getGuiState().value).toEqual('start')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
    nextGuiState()
    expect(getGuiState().value).toEqual('evaluation')
    nextGuiState()
    expect(getGuiState().value).toEqual('postevaluation')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
  })
  test('skip evaluation', () => {
    skipEvaluationScreen.value = true
    expect(getGuiState().value).toEqual('start')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
    nextGuiState()
    expect(getGuiState().value).toEqual('start')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
  })
  test('skip both', () => {
    skipEvaluationScreen.value = true
    skipStartScreen.value = true
    expect(getGuiState().value).toEqual('start')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
  })
})

describe('nextGuiState with humans only', () => {
  beforeEach(()=>{
    GameHandler.getInstance().setPlayers(0, 0)
  })
  test('no skips', () => {
    expect(getGuiState().value).toEqual('start')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
    nextGuiState()
    expect(getGuiState().value).toEqual('postevaluation')
    nextGuiState()
    expect(getGuiState().value).toEqual('start')
  })
  test('skip start', () => {
    skipStartScreen.value = true
    expect(getGuiState().value).toEqual('start')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
    nextGuiState()
    expect(getGuiState().value).toEqual('postevaluation')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
  })
  test('skip evaluation still shows post-evaluation in human-only game', () => {
    skipEvaluationScreen.value = true
    expect(getGuiState().value).toEqual('start')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
    nextGuiState()
    expect(getGuiState().value).toEqual('postevaluation')
    nextGuiState()
    expect(getGuiState().value).toEqual('start')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
  })
  })


function resetGuiState() {
  setGuiState('start')
  skipEvaluationScreen.value = false
  skipStartScreen.value = false
}
