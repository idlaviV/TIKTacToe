<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import PlayButton from './MainScreenMovesPlayButton.vue'
import { ref, watch, type Ref } from 'vue'
import { getGuiState , updateGuiDisable} from '@/logic/GuiState'
import { setAutoPlay, getAutoPlay, toggleAutoPlay, getMoveSpeed } from '@/logic/AutoPlayTimer';

const gameHandler = GameHandler.getInstance()
const moveSpeed: Ref<number> = getMoveSpeed()
const movesDisabled: Ref<boolean> = ref(false)



const updateMoveButtonDiable = () => {
  movesDisabled.value = gameHandler.getNumberOfAIs() == 0
}

watch(getGuiState(), (guiState) => {
  if (guiState == 'game') {
    updateMoveButtonDiable()
  }
})



/**
 * @description Informs the model, that the user wants to trigger the next AI turn.
 * Deactivates auto play.
 */
const nextAiTurn = () => {
  setAutoPlay(false)
  gameHandler.performAiTurn()
}
</script>

<!-- MainScreenMoves contains the control buttons for AI turns-->
<template>
  <div>
    <!-- The PlayButton toggles auto play. -->
    <PlayButton
      variant="outlined"
      :auto-play="getAutoPlay().value"
      :disabled="movesDisabled"
      @update:auto-play="toggleAutoPlay"
    >
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
      v-model="moveSpeed"
      v-on:change="updateGuiDisable()"
    />
  </div>
</template>

<style>
.slider {
  appearance: none;
  height: 1px;
  width: 100px;
  margin-bottom: 3px;
  margin-left: 8px;
  background: #d3d3d3;
  outline: none;
}

.slider::-moz-range-thumb {
  appearance: none;
  border: none;
  width: 12px;
  height: 12px;
  border-radius: 0;
  background: white;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  border: none;
  height: 12px;
  width: 12px;
  border-radius: 0;
  background: white;
  cursor: pointer;
}
</style>
