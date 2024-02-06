<script setup lang="ts">
import { skipEvaluation, skipStart } from '@/logic/GuiState'
import { ref } from 'vue'

const menu = ref(false)
</script>

<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" size="x-small" icon="mdi-wrench"></v-btn>
      </template>

      <v-card class="pe-4">
        <v-card>
          <v-checkbox-btn label="Automatische Belohnung" v-model="skipEvaluation"></v-checkbox-btn>
          <v-checkbox-btn label="Start überspringen" v-model="skipStart"></v-checkbox-btn>
        </v-card>
      </v-card>
    </v-menu>
  </div>
</template>
