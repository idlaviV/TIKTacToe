<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import PlayButton from './MainScreenMovesPlayButton.vue'
import { ref, watch, type Ref } from 'vue'
import { getGuiState, guiDisable } from '@/logic/GuiState'

const gameHandler = GameHandler.getInstance()
const autoPlay = ref(false)
let timer: ReturnType<typeof setTimeout>
const movesDisabled: Ref<boolean> = ref(false)
const moveSpeed = ref(2)

const toggleAutoPlay = () => {
  autoPlay.value = !autoPlay.value
  updateGuiDisable()
}

const updateMoveButtonDiable = () => {
  movesDisabled.value = gameHandler.getNumberOfAIs() == 0
}

watch(getGuiState(), (guiState) => {
  if (guiState == 'game') {
    startAutoPlayLoop()
    updateMoveButtonDiable()
  } else {
    clearTimeout(timer)
    updateGuiDisable()
  }
})

const updateGuiDisable = () => {
  if (
    getGuiState().value == 'game' &&
    gameHandler.getNumberOfAIs() == 2 &&
    autoPlay.value &&
    moveSpeed.value > 8
  ) {
    guiDisable.value = 'reduced'
  } else {
    guiDisable.value = 'standard'
  }
}

const startAutoPlayLoop = (immediateTurn = false) => {
  if (immediateTurn && autoPlay.value) {
    gameHandler.performAiTurn()
  }
  updateGuiDisable()

  clearTimeout(timer)
  timer = setTimeout(() => {
    if (autoPlay.value) {
      startAutoPlayLoop(true)
    }
  }, calculateTimeout())
}

const calculateTimeout = () => {
  if (moveSpeed.value == 9) {
    return 50
  }
  if (moveSpeed.value == 10) {
    return 5
  }
  return 2000 / moveSpeed.value
}

watch(autoPlay, startAutoPlayLoop)

/**
 * @description Informs the model, that the user wants to trigger the next AI turn.
 * Deactivates auto play.
 */
const nextAiTurn = () => {
  autoPlay.value = false
  updateGuiDisable()
  gameHandler.performAiTurn()
}
</script>

<!-- MainScreenMoves contains the control buttons for AI turns-->
<template>
  <div>
    <!-- The PlayButton toggles auto play. -->
    <PlayButton variant="outlined" :auto-play="autoPlay" :disabled="movesDisabled" @update:auto-play="toggleAutoPlay">
    </PlayButton>
    <!-- This button triggers the next AI turn, if possible-->
    <v-btn
      v-on:click="nextAiTurn"
      :disabled="movesDisabled"
      size="x-small"
      class="mx-2"
      icon="mdi-skip-next"
      variant="outlined"
    ></v-btn>
    <input
      :disabled="movesDisabled"
      type="range"
      min="1"
      max="10"
      class="slider"
      id="speed"
      v-model="moveSpeed"
    />
  </div>
</template>
