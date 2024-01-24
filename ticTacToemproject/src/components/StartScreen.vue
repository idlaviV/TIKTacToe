<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import { setGUiState } from '@/logic/GuiState'
import { graphExport } from '@/utils/GraphExport';
import { players, type PlayersExport, updatePlayerList } from '@/utils/PlayerListExport'
import { ref, type Ref } from 'vue'

/**
 * @description Starts the game and updates the gui state.
 */
function startGame() {
  console.log('Start game with')
  console.log('Player 1: %s', items.value.find((item) => item.index === select1.value)?.player)
  console.log('Player 2: %s', items.value.find((item) => item.index === select2.value)?.player)
  GameHandler.getInstance().setPlayers(select1.value, select2.value)
  graphExport.value.initializeHistory()
  setGUiState('game')
}

/**
 * @description The options for the player selection.
 */
updatePlayerList()
const items: Ref<PlayersExport> = players

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
  <div>
    <h2>Spielerauswahl</h2>

    <div>
      <v-select
        label="Spieler 1 wählen"
        v-model="select1"
        :items="items"
        item-title="player"
        item-value="index"
      />
      gegen
      <v-select
        label="Spieler 2 wählen"
        v-model="select2"
        :items="items"
        item-title="player"
        item-value="index"
      />
    </div>
    <v-btn v-on:click="startGame">Spiel starten</v-btn>
  </div>
</template>
