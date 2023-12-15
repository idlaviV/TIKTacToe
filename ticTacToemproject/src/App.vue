<script setup lang="ts">
import { ref } from 'vue'
import gameBoard from './components/GameBoard.vue'
import graph from './components/GraphPanel.vue'
</script>

<template>
  <main class="pt-8 bg-gray-800 text-center min-h-screen text-white">
    <div class="row flex-col">
      <div class="column">
        <gameBoard />
      </div>
      <div class="column">
        <graph />
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
