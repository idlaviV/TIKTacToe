<script setup lang="ts">
import LeftPanel from './components/LeftPanel.vue'
import GraphPanel from './components/GraphPanel.vue'
</script>

<template>
  <main>
   <v-container >
    <v-row>
      <v-col>
        <v-container><LeftPanel/></v-container>
      </v-col>
      <v-col>
        <v-container><GraphPanel/></v-container>
      </v-col>
    </v-row>
   </v-container>
  </main>
</template>

