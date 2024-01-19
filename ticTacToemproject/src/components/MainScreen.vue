<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import { drawStatus } from '@/logic/WinnerStatus'
import MainScreenBoard from './MainScreenBoard.vue'
import MainScreenMoves from './MainScreenMoves.vue'

const gameHandler: GameHandler = GameHandler.getInstance()
const winner = gameHandler.getWinner()
const playerOnTurn = gameHandler.getPlayerOnTurn()

const startEval = () => {
  gameHandler.performEndOfGameActions()
}
</script>

<!-- The main screen contains the gameboard and main controls. -->
<template>
  <div>
    <!-- Caption and prompt for next turn -->
    <h1 class="mb-8 text-3xl font-bold uppercase">Tic Tac Toe</h1>
    <v-container
      ><v-row
        ><v-col>
          <div class="text-pink-500">X Spieler 1</div>
          <div class="text-blue-500">O Spieler 2</div> </v-col
        ><v-col>
          <v-btn @click="startEval"> Belohnung ausführen </v-btn>
        </v-col></v-row
      ></v-container
    >
    <h3 :class="{ invisible: winner !== null }">Spieler {{ playerOnTurn }} ist dran</h3>

    <!-- The current gameboard -->
    <MainScreenBoard />

    <!-- Controls for AI turns -->
    <MainScreenMoves />
    <br /><br />
    <!-- Display winner -->
    <h2 v-if="winner === drawStatus" class="text-4xl dond-bold mb-8">Unentschieden!</h2>
    <h2 v-else-if="winner" class="text-4xl dond-bold mb-8">Spieler {{ winner }} hat gewonnen!</h2>
  </div>
</template>
<style>
.invisible {
  visibility: hidden;
}
</style>
