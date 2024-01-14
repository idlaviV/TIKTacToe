<script setup lang="ts">
import { GameHandler } from '../logic/GameHandler'

const gameHandler: GameHandler = GameHandler.getInstance()
const gameBoard = gameHandler.getGBHandler().getGameBoardExport()

const MakeMove = (x: number, y: number) => {
  gameHandler.performTurnFromUserInput(x, y)
}
</script>

<template>
  <div class="flex flex-col items-center mb-8">
    <div v-for="(row, x) in gameBoard.state" :key="x" class="flex">
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
</template>
