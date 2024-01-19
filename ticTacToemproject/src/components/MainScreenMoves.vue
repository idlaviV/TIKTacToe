<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import PlayButton from './MainScreenMovesPlayButton.vue'
import { ref, watch } from 'vue'
import { getGuiState } from '@/logic/GuiState'

const gameHandler = GameHandler.getInstance()
const autoPlay = ref(false)
let timer: ReturnType<typeof setTimeout>

const toggleAutoPlay = () => {
  console.log('toggleAutoPlay')
  autoPlay.value = !autoPlay.value
}

const performAiTurnIfGameIsRunning = () => {
  console.log('performAiTurnIfGameIsRunning')
  if (getGuiState().value == 'game') {
    gameHandler.performAiTurn()
  } else {
    clearInterval(timer)
  }
}

const startTimer = () => {
  if (autoPlay.value) {
    timer = setInterval(performAiTurnIfGameIsRunning, 1000)
  } else {
    clearInterval(timer)
  }
}

watch(getGuiState(), (guiState) => {
  console.log('guiState changed to ' + guiState)
  if (guiState == 'game') {
    startTimer()
  }
})

watch(autoPlay, (status) => {
  console.log('autoPlay changed to ' + status)
  startTimer()
})

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
    <PlayButton :auto-play="autoPlay" @update:auto-play="toggleAutoPlay"> </PlayButton>
    <!-- This button triggers the next AI turn, if possible-->
    <v-btn @click="nextAiTurn">
      <i class="material-icons"> skip_next </i>
    </v-btn>
  </div>
</template>
