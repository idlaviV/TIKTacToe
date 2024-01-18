<script setup lang="ts">
import LeftPanel from './components/LeftPanel.vue'
import RightPanel from './components/RightPanel.vue'
</script>

<template>
  <main>
    <v-container>
      <v-row>
        <v-col class="text-center">
          <v-container><LeftPanel /></v-container>
        </v-col>
        <v-col>
          <v-container><RightPanel /></v-container>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>
