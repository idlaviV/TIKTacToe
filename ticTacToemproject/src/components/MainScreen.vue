<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import { drawStatus } from '@/logic/WinnerStatus'
import MainScreenBoard from './MainScreenBoard.vue'
import MainScreenMoves from './MainScreenMoves.vue'
import SettingsPopover from './SettingsPopover.vue'
import { player1Name, player2Name } from '@/utils/ActivePlayerExport'
import { getGuiState, nextGuiState, skipEvaluation } from '@/logic/GuiState'
import { ref, watch } from 'vue'

const gameHandler: GameHandler = GameHandler.getInstance()
const winner = gameHandler.getWinner()
const playerOnTurn = gameHandler.getPlayerOnTurn()
let wasEvalApplied = ref(false)

const startEval = () => {
  gameHandler.performEndOfGameActions(true)
  wasEvalApplied.value = true
}

const skipEval = () => {
  gameHandler.performEndOfGameActions(false)
  gameHandler.resetGame()
  nextGuiState()
}

const finishEvaluation = () => {
  nextGuiState()
  gameHandler.resetGame()
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
      wasEvalApplied.value = false
      nextGuiState()
    } else {
      gameHandler.performEndOfGameActions(true)
      gameHandler.resetGame()
      nextGuiState()
    }
  }
}

const changePlayerDisplay = () => {
  if (winner.value === null) {
    if (playerOnTurn.value === 1) {
      document.getElementById('player1Display')?.classList.add('font-bold')
      document.getElementById('player2Display')?.classList.remove('font-bold')
    } else {
      document.getElementById('player1Display')?.classList.remove('font-bold')
      document.getElementById('player2Display')?.classList.add('font-bold')
    }
  } else {
    document.getElementById('player1Display')?.classList.remove('font-bold')
    document.getElementById('player2Display')?.classList.remove('font-bold')
  }
}

watch(playerOnTurn, changePlayerDisplay)
watch(winner, goToEvaluation)
</script>

<!-- The main screen contains the gameboard and main controls. -->
<template>
  <div id="mainScreen">
    <!-- Caption and prompt for next turn -->
    <h1 class="tictactoe bigarcade">Tic Tac Toe</h1>

    <div id="settingsButton">
      <SettingsPopover />
    </div>

    <v-row>
      <v-col />
        <v-col cols="7" class="pixelify text-xl">
          <div class="text-left text-pink-500 playerOnTurn" id="player1Display">X {{ player1Name }}</div>
          <div class="text-left text-blue-500" id="player2Display">O {{ player2Name }}</div>
        </v-col>
      <v-col />
    </v-row>

    <div class="my-3 pixelify">
      <v-row no-gutters align="center" id="player1Display" class="text-pink-500 font-bold">
        <v-col />
        <v-col cols="0">X</v-col>
        <v-col cols="6" class="text-left">{{ player1Name }}</v-col>
        <v-col />
      </v-row>
      <v-row no-gutters align="center" id="player2Display" class="text-blue-500">
        <v-col />
        <v-col cols="0">O</v-col>
        <v-col cols="6" class="text-left">{{ player2Name }}</v-col>
        <v-col />
      </v-row>
    </div>
    <!-- The current gameboard -->
    <MainScreenBoard />

    <!-- Controls for AI turns -->
    <MainScreenMoves />
    <br /><br />
    <!-- Display winner -->
    <h2 v-show="winner === drawStatus" class="text-4xl mb-8">Unentschieden!</h2>
    <h2 v-show="winner === 1 || winner === 2" class="text-4xl mb-8">
      Spieler {{ winner }} hat gewonnen!
    </h2>
    <div v-if="winner !== null">
      <v-btn class="bg-white" v-show="!wasEvalApplied" @click="startEval"> Belohnung anwenden </v-btn>
      <v-btn class="bg-white" v-show="!wasEvalApplied" @click="skipEval"> Überspringen </v-btn>
      <v-btn class="bg-white" v-show="wasEvalApplied" @click="finishEvaluation"> Weiter </v-btn>
    </div>
  </div>
</template>
<style>
#mainScreen {
  position: relative;
}

#settingsButton {
  position: absolute;
  top: 0;
  right: 0;
}

.playerDisplay {
  max-width: 250px;
}

.invisible {
  visibility: hidden;
}
</style>
