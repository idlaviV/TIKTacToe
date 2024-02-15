import { initializeHistory } from '@/utils/GraphExport'
import { ref, type Ref } from 'vue'
import { GameHandler } from './GameHandler'

export const skipStartScreen = ref(false)
export const skipEvaluationScreen = ref(false)
export const useDigitalFont = ref(true)
/**
 * The state of the GUI
 * 'start' for player selection,
 * 'game' for the game itself,
 * 'evaluation' for the application of the evaluation strategy.
 */
export type GuiState = 'start' | 'game' | 'evaluation' | 'postevaluation'
const state: Ref<GuiState> = ref('start')

export type GuiDisable = 'standard' | 'reduced'
export const guiDisable: Ref<GuiDisable> = ref('standard')
const cleaningTasksPreStart: (() => void)[] = []

/**
 * Register a new task. It will be called on all subsequent transitions from gui-state 'post-evaluation'
 * @param foo a method which can be called without arguments
 */
export function registerCleaningTaskPreStart(foo: () => void) {
  cleaningTasksPreStart.push(foo)
}

function performCleaningTasksPreStart() {
  for (const task of cleaningTasksPreStart) {
    task()
  }
}

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
      if (!skipEvaluationScreen.value) {
        break
      }
    /* falls through */
    case 'evaluation':
      GameHandler.getInstance().performEndOfGameActions(!skipEvaluationOnce)
      state.value = 'postevaluation'
      if (!skipEvaluationScreen.value && !skipEvaluationOnce) {
        break
      }
    /* falls through */
    case 'postevaluation':
      performCleaningTasksPreStart()
      state.value = 'start'
      GameHandler.getInstance().resetGame()
      if (!skipStartScreen.value) {
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
