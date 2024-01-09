<script setup lang="ts">
import { drawStatus } from '../logic/WinnerStatus'
import { GameHandler } from '../logic/GameHandler'

const gameHandler:GameHandler = GameHandler.getInstance()
gameHandler.getGBHandler().getEmitter().on('gameBoardChange',() =>{
  console.log("Something changed")})


const MakeMove = (x: number, y: number) => {
  gameHandler.performTurnFromUserInput(x, y)
}

const ResetGame = () => {
  gameHandler.resetGame()
  gameHandler.getPlayerOnTurn()
}
</script>

<template>
  <h1 class="mb-8 text-3xl font-bold uppercase">Tic Tac Toe</h1>

  <h3 class="text-xl mb-4">Player {{ gameHandler.getPlayerOnTurn() }}'s turn</h3>

  <div class="flex flex-col items-center mb-8">
    <div v-for="(row, x) in gameHandler.getGBHandler().gameBoard.state" :key="x" class="flex">
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

  <h2 v-if="gameHandler.getWinner() === drawStatus" class="text-6xl dond-bold mb-8">
    Draw!
  </h2>
  <h2 v-else-if="gameHandler.getWinner()" class="text-6xl dond-bold mb-8">
    Player {{ gameHandler.getWinner() }} wins!
  </h2>

  <v-btn @click="gameHandler.performAiTurn()"> &#9655; </v-btn>

  <br />
  <br />

  <v-btn @click="ResetGame"> Reset Game </v-btn>
</template>
