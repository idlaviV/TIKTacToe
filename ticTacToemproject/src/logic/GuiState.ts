import { ref, type Ref } from 'vue'

export const skipStart = ref(false)
export const skipEvaluation = ref(false)
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

/**
 * For debugging purposes only.
 */
export function setGuiState(newState: GuiState): void {
  state.value = newState
}

/**
 * Switches to the next GUI state.
 * If we skip this state, we immediatly switch to the next one.
 */
export function nextGuiState() {
  switch (state.value) {
    case 'game':
      state.value = 'evaluation'
      if (!skipEvaluation.value) {
        break
      }
    /* falls through */
    case 'evaluation':
      state.value = 'start'
      if (!skipStart.value) {
        break
      }
    /* falls through */
    case 'start':
    default:
      state.value = 'game'
      break
  }
}
