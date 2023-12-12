<script setup lang="ts">
import { ref } from 'vue'
import gameBoard from './components/gameBoard.vue'
import graph from './components/graph.vue'
</script>

<template>
  <main class="pt-8 text-center bg-gray-800 min-h-screen text-white">
    <gameBoard />

    <div></div>
    
    <graph />
  </main>
</template>

<style></style>
