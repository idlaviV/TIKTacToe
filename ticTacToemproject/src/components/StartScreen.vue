<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits(['startGame'])

/**
 * @description Starts the game and should pass the configuration to the LeftPanel component.
 * @todo Pass the configuration to LeftPanel.
 */
function startGame() {
  console.log('Start game with')
  //We can access the options via the model
  console.log('Player 1: %s', items[select1.value].player)
  console.log('Player 2: %s', items[select2.value].player)
  //Later on, those options should be passed to the backend
  emit('startGame')
}

/**
 * @description The options for the player selection.
 * @todo Fetch this from the backend.
 */
const items = [
  { player: 'Human', index: 0 },
  { player: 'AI', index: 1 }
]

/**
 * Model for the player selection for player one
 */
const select1 = ref(0)
/**
 * Model for the player selection for player two
 */
const select2 = ref(1)
</script>

<!-- The StartScreen offers the selection of the players for the next game. -->
<template>
  <h2>Spielerauswahl</h2>

  <div>
    <v-select
      label="Choose player 1"
      v-model="select1"
      :items="items"
      item-title="player"
      item-value="index"
    />
    vs.
    <v-select
      label="Choose player 2"
      v-model="select2"
      :items="items"
      item-title="player"
      item-value="index"
    />
  </div>
  <v-btn v-on:click="startGame">Start Game</v-btn>
</template>
