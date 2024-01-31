<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import PlayButton from './MainScreenMovesPlayButton.vue'
import { ref, watch, type Ref } from 'vue'
import { getGuiState } from '@/logic/GuiState'

const gameHandler = GameHandler.getInstance()
const autoPlay = ref(false)
let timer: ReturnType<typeof setTimeout>
const movesDisabled: Ref<boolean> = ref(false)
const moveSpeed = ref(10)

const toggleAutoPlay = () => {
  autoPlay.value = !autoPlay.value
}

const performAiTurnIfGameIsRunning = () => {
  if (getGuiState().value == 'game') {
    gameHandler.performAiTurn()
  } else {
    clearInterval(timer)
  }
}

const startTimerIfAutoPlay = () => {
  if (autoPlay.value) {
    timer = setInterval(performAiTurnIfGameIsRunning, 1000)
  } else {
    clearInterval(timer)
  }
}

const areMoveButtonsDisabled = () => {
  movesDisabled.value = gameHandler.getNumberOfAIs() == 0
}

watch(getGuiState(), (guiState) => {
  if (guiState == 'game') {
    startTimerIfAutoPlay()
    areMoveButtonsDisabled()
  } else {
    clearInterval(timer)
  }
})

watch(autoPlay, startTimerIfAutoPlay)

/**
 * @description Informs the model, that the user wants to trigger the next AI turn.
 * Deactivates auto play.
 */
const nextAiTurn = () => {
  autoPlay.value = false
  gameHandler.performAiTurn()
}
</script>

<!-- MainScreenMoves contains the control buttons for AI turns-->
<template>
  <div>
    <!-- The PlayButton toggles auto play. -->
    <PlayButton :auto-play="autoPlay" :disabled="movesDisabled" @update:auto-play="toggleAutoPlay">
    </PlayButton>
    <!-- This button triggers the next AI turn, if possible-->
    <v-btn :disabled="movesDisabled" @click="nextAiTurn">
      <i class="material-icons"> skip_next </i>
    </v-btn>
    <input type="range" min="1" max="100" class="slider" id="speed" v-model="moveSpeed">
  </div>
</template>
