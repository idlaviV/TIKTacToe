import { GameHandler } from '@/logic/GameHandler'
import { resetGameHandler } from './TestUtil'
import { expect, beforeEach, describe, test } from 'vitest'
import { getGuiState, nextGuiState, setGuiState, skipEvaluation, skipStart } from '@/logic/GuiState'

beforeEach(() => {
  GameHandler.getInstance()
  resetGameHandler()
  resetGuiState()
})

describe('nextGuiState', () => {
  test('no skips', () => {
    expect(getGuiState().value).toEqual('start')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
    nextGuiState()
    expect(getGuiState().value).toEqual('evaluation')
    nextGuiState()
    expect(getGuiState().value).toEqual('start')
  })
  test('skip start', () => {
    skipStart.value = true
    expect(getGuiState().value).toEqual('start')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
    nextGuiState()
    expect(getGuiState().value).toEqual('evaluation')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
  })
  test('skip evaluation', () => {
    skipEvaluation.value = true
    expect(getGuiState().value).toEqual('start')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
    nextGuiState()
    expect(getGuiState().value).toEqual('start')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
  })
  test('skip both', () => {
    skipEvaluation.value = true
    skipStart.value = true
    expect(getGuiState().value).toEqual('start')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
    nextGuiState()
    expect(getGuiState().value).toEqual('game')
  })
})

function resetGuiState() {
  setGuiState('start')
  skipEvaluation.value = false
  skipStart.value = false
}
