<script setup lang="ts">
import { GameHandler } from '../logic/GameHandler'
import { symbol } from '../logic/FieldType'

const gameHandler: GameHandler = GameHandler.getInstance()
const gameBoard = gameHandler.getGBHandler().getGameBoardExport()

/**
 * Pass a move from user input to the model.
 * @param x Column of the move.
 * @param y Row of the move.
 */
const MakeMove = (x: number, y: number) => {
  gameHandler.performTurnFromUserInput(x, y)
}
</script>

<!-- The MainScreenBoard visualizes the state of the gameboard. -->
<template>
  <div class="flex flex-col items-center mb-8 pixelify">
    <!-- Iterate rows and columns of the gameboard -->
    <div v-for="(row, x) in gameBoard.state" :key="x" class="flex">
      <div
        v-for="(cell, y) in row"
        :key="y"
        @click="MakeMove(x, y)"
        :class="`border border-white w-20 h-20 hover:bg-gray-700 flex items-center justify-center text-4xl cursor-pointer ${
          cell === 1 ? 'text-pink-500' : 'text-blue-500'
        }`"
      >
        <!-- Render proper symbol for player -->
        {{ symbol(cell) }}
      </div>
    </div>
  </div>
</template>
