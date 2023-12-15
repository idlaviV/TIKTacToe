<script setup lang="ts">
import { ref } from 'vue'
import GameBoard from './components/GameBoard.vue'
import { GameHandler } from './logic/GameHandler'
import GraphPanel from './components/GraphPanel.vue'
const gameHandler = ref(new GameHandler())
const gBHandler = ref(gameHandler.value.getGBHandler())
</script>

<template>
  <main class="pt-8 bg-gray-800 text-center min-h-screen text-white">
    <div class="row flex-col">
      <div class="column">
        <GameBoard :game-handler="gameHandler" :g-b-handler="gBHandler" />
      </div>
      <div class="column">
        <GraphPanel :nodes="gameHandler.getHistoryExport().nodes" :edges="gameHandler.getHistoryExport().edges"/>
      </div>
    </div>
  </main>
</template>

<style>
.column {
  float: left;
  width: 50%;
}
</style>
