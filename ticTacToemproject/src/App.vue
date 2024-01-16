<script setup lang="ts">
import LeftPanel from './components/LeftPanel.vue'
import RightPanel from './components/RightPanel.vue'


</script>

<template>
  <main class="pt-8 bg-gray-800 text-center min-h-screen text-white">
    <div class="row flex-col">
      <div class="column">
        <LeftPanel />
      </div>
      <div class="column">
        <RightPanel/>
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
