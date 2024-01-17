<script setup lang="ts">
import { setLeftScreen, getLeftScreen } from '@/utils/GuiStates';
import MainScreen from './MainScreen.vue'
import StartScreen from './StartScreen.vue'

/**
 * @description Starts the game and shoud pass the configuration to the model.
 * @todo Pass the configuration to the model.
 */
function startGame() {
  console.log('Game started (and your configuration was intentionally ignored)')
  setLeftScreen('MainScreen')
}
</script>

<!-- The LeftPanel contains player selection, the main screen or evaluation policy,
   depending on the global state. -->
<template>
  <div>
    <MainScreen v-if="getLeftScreen() === 'MainScreen'" />
    <StartScreen v-else @start-game="startGame" />
  </div>
</template>
