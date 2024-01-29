<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import { drawStatus } from '@/logic/WinnerStatus'
import MainScreenBoard from './MainScreenBoard.vue'
import MainScreenMoves from './MainScreenMoves.vue'
import { player1Name, player2Name } from '@/utils/ActivePlayerExport'
import { getGuiState, nextGuiState, skipEvaluation, skipStart } from '@/logic/GuiState'
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
    <h1 class="mb-8 text-3xl font-bold uppercase">Tic Tac Toe</h1>
    <v-container
      ><v-row
        ><v-col>
          <v-row class="text-pink-500" justify="end" no-gutters>
            <v-col cols="1">X</v-col><v-col class="text-left" cols="5">{{ player1Name }}</v-col>
          </v-row>
          <v-row class="text-blue-500" justify="end" no-gutters>
            <v-col cols="1">O</v-col><v-col class="text-left" cols="5">{{ player2Name }}</v-col>
          </v-row> </v-col
        ><v-col>
          <v-checkbox label="Automatische Belohnung" v-model="skipEvaluation"></v-checkbox>
          <v-checkbox label="Start überspringen" v-model="skipStart"></v-checkbox> </v-col></v-row
    ></v-container>
    <h3 :class="{ invisible: winner !== null }">Spieler {{ playerOnTurn }} ist dran</h3>

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
