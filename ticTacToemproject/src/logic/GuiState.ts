import { ref, type Ref } from 'vue'

export type GuiState = 'start' | 'game' | 'evaluation'
const state: Ref<GuiState> = ref('start')

export function getGuiState(): Ref<GuiState> {
  return state
}

export function setGUiState(newState: GuiState) {
  state.value = newState
}
