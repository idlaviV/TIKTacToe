<script setup lang="ts">
import type { PlayerNumber } from './logic/PlayerNumber'
import { GameBoardHandler } from './logic/GameBoardHandler'
import { ref } from 'vue'

const player = ref<PlayerNumber>(1)
const handler = ref(new GameBoardHandler())

const MakeMove = (x: number, y: number) => {
  handler.value.move(x, y, player.value)
  player.value = player.value === 1 ? 2 : 1
}

const ResetGame = () => {
  handler.value.resetGame()
  player.value = 1
}
</script>

<template>
  <main class="pt-8 text-center bg-gray-800 min-h-screen text-white">
    <h1 class="mb-8 text-3xl font-bold uppercase">Tic Tac Toe</h1>

    <h3 class="text-xl mb-4">Player {{ player }}'s turn</h3>

    <div class="flex flex-col items-center mb-8">
      <div v-for="(row, x) in handler.gameBoard.state" :key="x" class="flex">
        <div
          v-for="(cell, y) in row"
          :key="y"
          @click="MakeMove(x, y)"
          :class="`border border-white w-20 h-20 hover:bg-gray-700 flex items-center justify-center text-4xl cursor-pointer ${
            cell === 1 ? 'text-pink-500' : 'text-blue-500'
          }`"
        >
          {{ cell === 1 ? 'X' : cell === 2 ? 'O' : '' }}
        </div>
      </div>
    </div>

    <h2 v-if="handler.winner === -1" class="text-6xl dond-bold mb-8">Draw!</h2>
    <h2 v-else-if="handler.winner" class="text-6xl dond-bold mb-8">
      Player {{ handler.winner }} wins!
    </h2>

    <button
      @click="ResetGame"
      class="px-4 py-2 bg-pink-500 rounded uppercase font-bold hover:bg-pink-600 duration-300"
    >
      Reset Game
    </button>
  </main>
</template>

<style></style>
