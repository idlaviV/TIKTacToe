<script setup lang="ts">
import MainScreen from './components/MainScreen.vue'
import GraphPanel from './components/GraphPanel.vue'
</script>

<template>
  <main class="pt-8 bg-gray-800 text-center min-h-screen text-white">
    <div class="row flex-col">
      <div class="column">
        <MainScreen/>
      </div>
      <div class="column">
        <GraphPanel />
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
