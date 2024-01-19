<script setup lang="ts">
import { getGuiState, type GuiState } from '@/logic/GuiState'
import GraphPanel from './GraphPanel.vue'
import AISelectionPanel from './AISelectionPanel.vue'
import type { Ref } from 'vue'
const guiState: Ref<GuiState> = getGuiState()
</script>

<template>
  <AISelectionPanel v-show="guiState == 'start'" />
  <GraphPanel v-show="guiState !== 'start'" />
</template>
