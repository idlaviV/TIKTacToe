<script setup lang="ts">
import { skipEvaluationScreen, skipStartScreen, useDigitalFont } from '@/logic/GuiState'

const setFont = () => {
  if (useDigitalFont.value) {
    document.body.style.fontFamily = 'Pixelify Sans'
  } else {
    document.body.style.fontFamily = ''
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
        alt="Wechsle automatische Belohnung ein/aus"
      ></v-checkbox-btn>
      <v-checkbox-btn
        label="Start überspringen"
        v-model="skipStartScreen"
        alt="Wechsle start überspringen ein/aus"
      ></v-checkbox-btn>
      <v-switch
        class="mx-2"
        v-model="useDigitalFont"
        label="Benutze digitale Schriftart"
        @update:model-value="setFont"
        alt="Wechsle Schriftart"
      ></v-switch>
    </div>
  </v-card>
</template>
