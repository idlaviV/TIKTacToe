<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import { Players, type PlayersExport, updatePlayerList } from '@/utils/PlayerListExport'
import { ref, type Ref } from 'vue'
const emit = defineEmits(['startGame'])

/**
 * @description Starts the game and should pass the configuration to the LeftPanel component.
 * @todo Pass the configuration to LeftPanel.
 */
function startGame() {
  console.log('Start game with')
  //We can access the options via the model
  console.log('Player 1: %s', items.value.find((item) => item.index === select1.value)?.player)
  console.log('Player 2: %s', items.value.find((item) => item.index === select2.value)?.player)
  //Later on, those options should be passed to the backend
  GameHandler.getInstance().setPlayers(select1.value, select2.value)
  emit('startGame')
}

/**
 * @description The options for the player selection.
 * @todo Later on, the manual update should be removed and the list should be updated automatically.
 */
updatePlayerList()
const items: Ref<PlayersExport> = Players

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
@/utils/PlayerListExport
