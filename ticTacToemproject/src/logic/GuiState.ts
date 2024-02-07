import { initializeHistory } from '@/utils/GraphExport'
import { ref, type Ref } from 'vue'
import { GameHandler } from './GameHandler'

export const skipStart = ref(false)
export const skipEvaluation = ref(false)
/**
 * The state of the GUI
 * 'start' for player selection,
 * 'game' for the game itself,
 * 'evaluation' for the application of the evaluation strategy.
 */
export type GuiState = 'start' | 'game' | 'evaluation' |'postevaluation'
const state: Ref<GuiState> = ref('start')

export type GuiDisable = 'standard' | 'reduced'
export const guiDisable: Ref<GuiDisable> = ref('standard')

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
 * Performs the necessary actions for the transition.
 * @param skipEvaluationOnce if true, the evaluation is not performed and postevaluation is skipped.
 */
export function nextGuiState(skipEvaluationOnce: boolean = false) {
  switch (state.value) {
    case 'game':
      state.value = 'evaluation'
      if (!skipEvaluation.value) {
        break
      }
    /* falls through */
    case 'evaluation':
      GameHandler.getInstance().performEndOfGameActions(!skipEvaluationOnce)
      state.value = 'postevaluation'
      if(!skipEvaluation.value && !skipEvaluationOnce) {
        break
      }
    /* falls through */
    case 'postevaluation':
      state.value = 'start'
      GameHandler.getInstance().resetGame()
      if (!skipStart.value) {
        break
      }
    /* falls through */
    case 'start':
      initializeHistory()
    /* falls through */
    default:
      state.value = 'game'
      break
  }
  console.log('New state: ' + state.value)
}
