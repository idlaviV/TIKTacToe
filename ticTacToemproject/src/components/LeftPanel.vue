<script setup lang="ts">
import { getGuiState } from '@/logic/GuiState'
import MainScreen from './MainScreen.vue'
import StartScreen from './StartScreen.vue'

const guiState = getGuiState()
</script>

<!-- The LeftPanel contains player selection, the main screen or evaluation policy,
   depending on the global state. -->
<template>
  <div>
    <StartScreen v-if="guiState == 'start'" />
    <MainScreen v-else />
  </div>
</template>
