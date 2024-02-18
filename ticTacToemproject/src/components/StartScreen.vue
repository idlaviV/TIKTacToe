<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import { nextGuiState } from '@/logic/GuiState'
import { players, type PlayersExport, updatePlayerList } from '@/utils/PlayerListExport'
import ExplainScreen from './ExplainScreen.vue'
import { ref, type Ref } from 'vue'

/**
 * @description Starts the game and updates the gui state.
 */
function startGame() {
  GameHandler.getInstance().setPlayers(select1.value, select2.value)
  nextGuiState()
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

const showHelp = ref(false)
</script>

<!-- The StartScreen offers the selection of the players for the next game. -->
<template>
  <v-card class="bg-black" align="center">
    <h1 class="tictactoe bigarcade inline">TIK Tac Toe</h1>

    <v-card class="playerSelection bg-black">
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
    </v-card>
    <v-card class="playerSelection bg-black">
      <v-btn v-on:click="startGame" class="bg-white">Spiel starten</v-btn>
      <v-btn id="help" v-bind:variant="showHelp === true ? 'outlined' : 'tonal'" @click="showHelp = !showHelp">?</v-btn>
    </v-card>
    <br />
    <ExplainScreen v-if="showHelp"/>
  </v-card>
  <br />
</template>

<style>
.playerSelection {
  max-width: 300px;
  justify-self: center;
  position: relative;
}

#help {
  position: absolute;
  right: 0;
  padding: 0;
  min-width: 0;
  width: 35px;
  height: 35px;
}
</style>
