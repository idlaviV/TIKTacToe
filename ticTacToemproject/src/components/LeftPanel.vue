<script setup lang="ts">
import { getGuiState } from '@/logic/GuiState';
import MainScreen from './MainScreen.vue'
import StartScreen from './StartScreen.vue'


/**
 * @type {boolean}
 * @description Toggles between the start screen and the main screen.
 */
const gameIsRunning = getGuiState()

/**
 * @description Starts the game and shoud pass the configuration to the model.
 * @todo Pass the configuration to the model.
 */
function startGame() {
  console.log('Game started (and your configuration was intentionally ignored)')
}
</script>

<!-- The LeftPanel contains player selection, the main screen or evaluation policy,
   depending on the global state. -->
<template>
  <div>
    <StartScreen
      v-if="gameIsRunning == 'start'" 
      @start-game="startGame" 
    />
    <MainScreen v-else />
    
  </div>
</template>
