import { ref, type Ref } from 'vue'

/**
 * The state of the GUI
 * 'start' for player selection,
 * 'game' for the game itself,
 * 'evaluation' for the application of the evaluation strategy.
 */
export type GuiState = 'start' | 'game' | 'evaluation'
const state: Ref<GuiState> = ref('start')

export function getGuiState(): Ref<GuiState> {
  return state
}

export function setGUiState(newState: GuiState) {
  state.value = newState
}
