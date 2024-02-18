<script setup lang="ts">
import { skipEvaluationScreen, skipStartScreen, useDigitalFont } from '@/logic/GuiState'

const setFont = () => {
  console.log('Ping')
  if (useDigitalFont.value) {
    document.body.style.fontFamily = 'Pixelify Sans'
    console.log('Now: Pixel')
  } else {
    document.body.style.fontFamily = ''
    console.log('Now:Plain')
  }
}
</script>

<template>
  <v-card class="mx-auto" variant="outlined" max-width="500">
    <div class="mx-2 my-2">
      <v-card-title>Einstellungen</v-card-title>
      <v-checkbox-btn
        label="Automatische Belohnung"
        v-model="skipEvaluationScreen"
      ></v-checkbox-btn>
      <v-checkbox-btn label="Start überspringen" v-model="skipStartScreen"></v-checkbox-btn>
      <v-switch
        class="mx-2"
        v-model="useDigitalFont"
        label="Benutze digitale Schriftart"
        @update:model-value="setFont"
      ></v-switch>
    </div>
  </v-card>
</template>
