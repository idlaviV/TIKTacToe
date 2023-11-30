<script setup lang="ts">
import { GameBoard } from './logic/GameBoard'
import type { PlayerNumber } from './logic/PlayerNumber'
import { move, calculateWinner } from './logic/GameBoardHandler'
// import { RouterLink, RouterView } from 'vue-router'
import { ref, computed } from 'vue'

const player = ref<PlayerNumber>(1);
const board = ref(new GameBoard([[0, 0, 0], [0, 0, 0], [0, 0, 0]]))

// const CalculateWinner = (squares: string[]) => {
//   const lines = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];
//   for (let i = 0; i < lines.length; i++) {
//     const [a, b, c] = lines[i];
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return squares[a];
//     }
//   }
//   return null;
// }

const winner = computed(() => calculateWinner(board.value.flat()))

// const MakeMove = (x: number, y: number) => {
//   if (winner.value) return

//   if (board.value[x][y] !== '') return

//   board.value[x][y] = player.value

//   player.value = player.value === 'X' ? 'O' : 'X'
// }

const ResetGame = () => {
  board.value = new GameBoard([[0, 0, 0], [0, 0, 0], [0, 0, 0]])
  player.value = 1
}
</script>

<template>
  <main class="pt-8 text-center dark:bg-gray-800 min-h-screen dark:text-white">
    <h1 class="mb-8 text-3xl font-bold uppercase">Tic Tac Toe</h1>

    <h3 class="text-xl mb-4">Player {{ player }}'s turn</h3>

    <div class="flex flex-col items-center mb-8">
      <div
        v-for="(row, x) in board.getState()"
        :key="x"
        class="flex">

        <div 
          v-for="(cell, y) in row"
          :key="y"
          @click="move(x, y, player)"
          :class="`border border-white w-20 h-20 hover:bg-gray-700 flex items-center justify-center text-4xl cursor-pointer ${ cell === 1 ? 'text-pink-500' : 'text-blue-500' }`">
          {{ cell === 1 ? 'X' : cell === 2 ? 'O' : '' }}
        </div>
      </div>
    </div>

    <h2 v-if="winner" class="text-6xl dond-bold mb-8">Player '{{ winner }}' wins!</h2>
    <!-- <RouterLink to="/about" v-if="winner">Bewertung</RouterLink> -->

    <button @click="ResetGame" class="px-4 py-2 bg-pink-500 rounded uppercase font-bold hover:bg-pink-600 duration-300">Reset Game</button>

    <!-- <RouterView /> -->
  </main>
</template>

<style>
</style>
