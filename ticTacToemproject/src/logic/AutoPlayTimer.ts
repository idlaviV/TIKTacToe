import { ref } from 'vue'
import { GameHandler } from './GameHandler'
import { getGuiState, updateGuiDisable } from './GuiState'

const autoPlay = ref(false)
let timer: ReturnType<typeof setTimeout>
const moveSpeed = ref(2)

export function timerRunsOut() {
  timer = setTimeout(timerRunsOut, calculateTimeout())
  if (autoPlay.value && getGuiState().value == 'game') {
    GameHandler.getInstance().performAiTurn()
  }
}

export function resetTimer() {
  clearTimeout(timer)
  timer = setTimeout(timerRunsOut, calculateTimeout())
}

function calculateTimeout() {
  if (moveSpeed.value == 9) {
    return 50
  }
  if (moveSpeed.value == 10) {
    return 5
  }
  return 2000 / moveSpeed.value
}

export function getAutoPlay() {
  return autoPlay
}

export function getMoveSpeed() {
  return moveSpeed
}

export function setAutoPlay(newAutoPlay: boolean) {
  autoPlay.value = newAutoPlay
  updateGuiDisable()
}

export function toggleAutoPlay() {
  setAutoPlay(!autoPlay.value)
}
