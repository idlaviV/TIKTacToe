<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import { drawStatus } from '@/logic/WinnerStatus'
import MainScreenBoard from './MainScreenBoard.vue'

const gameHandler: GameHandler = GameHandler.getInstance()
const winner = gameHandler.getWinner()
const playerOnTurn = gameHandler.getPlayerOnTurn()

const ResetGame = () => {
  gameHandler.resetGame()
  gameHandler.getPlayerOnTurn()
}
</script>

<template>
  <div>
    <h1 class="mb-8 text-3xl font-bold uppercase">Tic Tac Toe</h1>
    <h3 class="text-xl mb-4">Player {{ playerOnTurn }}'s turn</h3>

    <MainScreenBoard />

    <h2 v-if="winner === drawStatus" class="text-6xl dond-bold mb-8">Draw!</h2>
    <h2 v-else-if="winner" class="text-6xl dond-bold mb-8">Player {{ winner }} wins!</h2>

    <v-btn @click="gameHandler.performAiTurn()"> &#9655; </v-btn>

    <br />
    <br />

    <v-btn @click="ResetGame"> Reset Game </v-btn>
  </div>
</template>
