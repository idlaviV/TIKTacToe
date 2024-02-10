<script setup lang="ts">
import { skipEvaluation, skipStart, useDigitalFont } from '@/logic/GuiState'
import { ref } from 'vue'

const menu = ref(false)
</script>

<template>
  <v-card class="mx-auto" variant="outlined" max-width="500">
    <div class="mx-2 my-2">
      <v-card-title>Einstellungen</v-card-title>
      <v-checkbox-btn label="Automatische Belohnung" v-model="skipEvaluation"></v-checkbox-btn>
      <v-checkbox-btn label="Start überspringen" v-model="skipStart"></v-checkbox-btn>
      <v-switch class="mx-2" v-model="useDigitalFont" label="Benutze digital Font"></v-switch>
    </div>
  </v-card>
</template>
