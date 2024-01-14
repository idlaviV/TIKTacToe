<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import { drawStatus } from '@/logic/WinnerStatus'
import MainScreenBoard from './MainScreenBoard.vue'
import MainScreenMoves from './MainScreenMoves.vue';

const gameHandler: GameHandler = GameHandler.getInstance()
const winner = gameHandler.getWinner()
const playerOnTurn = gameHandler.getPlayerOnTurn()

const ResetGame = () => {
  gameHandler.resetGame()
}


</script>

<!-- The main screen contains the gameboard and main controls. -->
<template>
  <div>
    <!-- Caption and prompt for next turn -->
    <h1 class="mb-8 text-3xl font-bold uppercase">Tic Tac Toe</h1>
    <h3 class="text-xl mb-4">Player {{ playerOnTurn }}'s turn</h3>

    <!-- The current gameboard -->
    <MainScreenBoard />

    <!-- Display winner -->
    <h2 v-if="winner === drawStatus" class="text-6xl dond-bold mb-8">Draw!</h2>
    <h2 v-else-if="winner" class="text-6xl dond-bold mb-8">Player {{ winner }} wins!</h2>

    <!-- Controls for AI turns -->
    <MainScreenMoves />

    <br />
    <br />

    
    <div>
        <v-btn @click="ResetGame"> Reset Game </v-btn>
    </div>
    
  </div>
</template>
