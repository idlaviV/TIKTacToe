<script setup lang="ts">
import type { PlayerNumber } from './logic/PlayerNumber'
import { move, calculateWinner, getGameBoard, resetGameBoard, getWinner } from './logic/GameBoardHandler'
import { ref, computed } from 'vue'

const player = ref<PlayerNumber>(1)
const board = ref(getGameBoard())

const winner = ref(getWinner());

const MakeMove = (x: number, y: number) => {
  move(x, y, player.value);
  board.value = getGameBoard()
  winner.value = getWinner()
  player.value = player.value === 1 ? 2 : 1
};

const ResetGame = () => {
  resetGameBoard()
  board.value = getGameBoard()
  player.value = 1
}
</script>

<template>
  <main class="pt-8 text-center dark:bg-gray-800 min-h-screen dark:text-white">
    <h1 class="mb-8 text-3xl font-bold uppercase">Tic Tac Toe</h1>

    <h3 class="text-xl mb-4">Player {{ player }}'s turn</h3>

    <div class="flex flex-col items-center mb-8">
      <div
        v-for="(row, x) in board.state"
        :key="x"
        class="flex">

        <div 
          v-for="(cell, y) in row"
          :key="y"
          @click="MakeMove(x, y)"
          :class="`border border-white w-20 h-20 hover:bg-gray-700 flex items-center justify-center text-4xl cursor-pointer ${ cell === 1 ? 'text-pink-500' : 'text-blue-500' }`">
          {{ cell === 1 ? 'X' : cell === 2 ? 'O' : '' }}
        </div>
      </div>
    </div>

    <h2 v-if="winner" class="text-6xl dond-bold mb-8">Player {{ winner }} wins!</h2>

    <button @click="ResetGame" class="px-4 py-2 bg-pink-500 rounded uppercase font-bold hover:bg-pink-600 duration-300">Reset Game</button>

  </main>
</template>

<style>
</style>
