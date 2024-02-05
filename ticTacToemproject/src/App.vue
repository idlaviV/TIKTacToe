<script setup lang="ts">
import LeftPanel from './components/LeftPanel.vue'
import RightPanel from './components/RightPanel.vue'
import { useDisplay } from 'vuetify'

const mobile = useDisplay().smAndDown
</script>

<template>
  <main>
    <v-container v-if="!mobile">
      <v-row no-gutters>
        <v-col cols="4" class="text-center">
          <v-container><LeftPanel /></v-container>
        </v-col>
        <v-col>
          <v-container><RightPanel /></v-container>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else>
      <v-row no-gutters>
        <v-container class="text-center"><LeftPanel /></v-container>
        <v-container><RightPanel /></v-container>
      </v-row>
    </v-container>
  </main>
</template>
