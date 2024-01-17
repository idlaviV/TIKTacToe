<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import PlayButton from './MainScreenMovesPlayButton.vue'
import { ref } from 'vue'

const gameHandler = GameHandler.getInstance()
const autoPlay = ref(false)

const toggleAutoPlay = () => {
  autoPlay.value = !autoPlay.value
}

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
