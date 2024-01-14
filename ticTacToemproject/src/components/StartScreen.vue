<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits(['startGame'])

function startGame() {
  console.log('Start game with')
  //We can access the options via the model
  console.log('Player 1: %s', items[select1.value].player)
  console.log('Player 2: %s', items[select2.value].player)
  //Later on, those options should be passed to the backend
  emit('startGame')
}

//Later on, this should be fetched from the backend
const items = [
  { player: 'Human', index: 0 },
  { player: 'AI', index: 1 }
]

//Model for the selection in both selects
const select1 = ref(0)
const select2 = ref(1)
</script>

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
