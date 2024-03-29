<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import { drawStatus } from '@/logic/WinnerStatus'
import MainScreenBoard from './MainScreenBoard.vue'
import MainScreenMoves from './MainScreenMoves.vue'
import { player1Name, player2Name } from '@/utils/ActivePlayerExport'
import { getGuiState, nextGuiState, skipEvaluationScreen } from '@/logic/GuiState'
import { watch } from 'vue'
import { getAutoPlay, getMoveSpeed } from '@/logic/AutoPlayTimer'

const gameHandler: GameHandler = GameHandler.getInstance()
const winner = gameHandler.getWinner()
const playerOnTurn = gameHandler.getPlayerOnTurn()

const changePlayerDisplay = () => {
  if (winner.value === null && (getMoveSpeed().value < 10 || !getAutoPlay().value)) {
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
</script>

<!-- The main screen contains the gameboard and main controls. -->
<template>
  <v-card class="bg-black -my-8" align="center">
    <!-- Caption and prompt for next turn -->
    <h1 class="tictactoe bigarcade inline flipHorizontal">KIT</h1>
    <h1 class="tictactoe bigarcade inline">&nbsp;Tac Toe</h1>

    <v-col align="center">
      <v-card class="text-xl bg-black playerDisplay" align="center">
        <div id="player1Display" class="text-left text-pink-500 font-bold">X {{ player1Name }}</div>
        <div id="player2Display" class="text-left text-blue-500">O {{ player2Name }}</div>
      </v-card>
    </v-col>
    <!-- The current gameboard -->
    <MainScreenBoard />

    <!-- Controls for AI turns -->
    <MainScreenMoves />
    <br /><br />
    <!-- Display winner -->
    <div v-if="winner !== null">
      <!-- Don't show winner status on high speed autoplay-->
      <span
        v-if="getMoveSpeed().value < 9 || !skipEvaluationScreen || gameHandler.getNumberOfAIs() < 2"
      >
        <h2 v-if="winner === drawStatus" class="text-4xl mb-8">Unentschieden!</h2>
        <h2 v-if="winner === 1" class="text-3xl text-pink-500 mb-8">Spieler 1 gewinnt!</h2>
        <h2 v-if="winner === 2" class="text-3xl text-blue-500 mb-8">Spieler 2 gewinnt!</h2>
      </span>
      <v-btn
        class="my-2 mx-2 bg-white"
        v-show="getGuiState().value === 'evaluation'"
        @click="nextGuiState()"
      >
        Belohnen
      </v-btn>
      <v-btn
        class="my-2 mx-2"
        variant="outlined"
        v-show="getGuiState().value === 'evaluation'"
        @click="nextGuiState(true)"
      >
        Überspringen
      </v-btn>
      <v-btn
        class="my-2 mx-2 bg-white"
        v-show="getGuiState().value === 'postevaluation'"
        @click="nextGuiState()"
      >
        Weiter
      </v-btn>
    </div>
  </v-card>
</template>
<style>
.playerDisplay {
  max-width: 210px;
}
</style>
