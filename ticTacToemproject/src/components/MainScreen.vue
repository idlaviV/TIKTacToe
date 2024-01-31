<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import { drawStatus } from '@/logic/WinnerStatus'
import MainScreenBoard from './MainScreenBoard.vue'
import MainScreenMoves from './MainScreenMoves.vue'
import SettingsPopover from './SettingsPopover.vue'
import { player1Name, player2Name } from '@/utils/ActivePlayerExport'
import { getGuiState, nextGuiState, skipEvaluation } from '@/logic/GuiState'
import { watch } from 'vue'

const gameHandler: GameHandler = GameHandler.getInstance()
const winner = gameHandler.getWinner()
const playerOnTurn = gameHandler.getPlayerOnTurn()

const startEval = () => {
  gameHandler.performEndOfGameActions(true)
}

const skipEval = () => {
  gameHandler.performEndOfGameActions(false)
}

const changeVisibility = () => {
  if (winner !== null) {
    document.getElementById('playerOnTurnDisplay')?.classList.toggle('invisible')
  }
}

watch(winner, changeVisibility)

const goToEvaluation = () => {
  if (winner.value !== null && getGuiState().value === 'game') {
    if (!skipEvaluation.value) {
      nextGuiState()
    } else {
      startEval()
    }
  }
}

watch(winner, goToEvaluation)
</script>

<!-- The main screen contains the gameboard and main controls. -->
<template>
  <div>
    <!-- Caption and prompt for next turn -->
    <h1 class="text-3xl font-bold uppercase">Tic Tac Toe</h1>
    <SettingsPopover />
    <v-container>
      <div class="text-pink-500">X {{ player1Name }}</div>
      <div class="text-blue-500">O {{ player2Name }}</div>
    </v-container>
    <h3 class="text-xl" id="playerOnTurnDisplay">Spieler {{ playerOnTurn }} ist dran</h3>
    <!-- The current gameboard -->
    <MainScreenBoard />

    <!-- Controls for AI turns -->
    <MainScreenMoves />
    <br /><br />
    <!-- Display winner -->
    <h2 v-show="winner === drawStatus" class="text-4xl dond-bold mb-8">Unentschieden!</h2>
    <h2 v-show="winner === 1 || winner === 2" class="text-4xl dond-bold mb-8">
      Spieler {{ winner }} hat gewonnen!
    </h2>
    <div v-if="winner !== null">
      <v-btn @click="startEval"> Belohnung anwenden </v-btn>
      <v-btn @click="skipEval"> Überspringen </v-btn>
    </div>
  </div>
</template>
<style>
.invisible {
  visibility: hidden;
}
</style>
