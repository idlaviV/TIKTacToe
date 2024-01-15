<script setup lang="ts">
import MainScreen from './MainScreen.vue'
import StartScreen from './StartScreen.vue'
import { ref } from 'vue'

/**
 * @type {boolean}
 * @description Toggles between the start screen and the main screen.
 */
let gameIsRunning = ref(false)

/**
 * @description Starts the game and shoud pass the configuration to the model.
 * @todo Pass the configuration to the model.
 */
function startGame() {
  console.log('Game started (and your configuration was intentionally ignored)')
  gameIsRunning.value = true
}
</script>

<!-- The LeftPanel contains player selection, the main screen or evaluation policy,
   depending on the global state. -->
<template>
  <div>
    <MainScreen v-if="gameIsRunning" />
    <StartScreen v-else @start-game="startGame" />
  </div>
</template>
