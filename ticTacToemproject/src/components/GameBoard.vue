<script setup lang="ts">
import { drawStatus } from '../logic/WinnerStatus'
import { GameHandler } from '../logic/GameHandler'
import { GameBoardHandler } from '@/logic/GameBoardHandler'

const props = defineProps({
  gameHandler: GameHandler,
  gBHandler: GameBoardHandler
})

const MakeMove = (x: number, y: number) => {
  props.gameHandler?.performTurnFromUserInput(x, y)
}

const ResetGame = () => {
  props.gameHandler?.resetGame()
  props.gameHandler?.getPlayerOnTurn()
}
</script>

<template>
  <h1 class="mb-8 text-3xl font-bold uppercase">Tic Tac Toe</h1>

  <h3 class="text-xl mb-4">Player {{ props.gameHandler?.getPlayerOnTurn() }}'s turn</h3>

  <div class="flex flex-col items-center mb-8">
    <div v-for="(row, x) in props.gBHandler?.gameBoard.state" :key="x" class="flex">
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

  <h2 v-if="props.gameHandler?.getWinner() === drawStatus" class="text-6xl dond-bold mb-8">
    Draw!
  </h2>
  <h2 v-else-if="props.gameHandler?.getWinner()" class="text-6xl dond-bold mb-8">
    Player {{ props.gameHandler.getWinner() }} wins!
  </h2>

  <v-btn @click="props.gameHandler?.performAiTurn()"> &#9655; </v-btn>

  <br />
  <br />

  <v-btn @click="ResetGame"> Reset Game </v-btn>
</template>
