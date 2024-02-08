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
      <v-row class="text-center" no-gutters>
        <v-container><LeftPanel /></v-container>
        <v-container><RightPanel /></v-container>
      </v-row>
    </v-container>
  </main>
</template>

<style>
html {
  background-color: black;
}

.bigarcade {
  font-family: "8_big_arcade";
}

.dogica {
  font-family: "dogica";
}

.tictactoe {
  font-size: 50px;
}

@font-face {
    font-family: "8_big_arcade";
    src: url('./assets/fonts/8_bit_arcade/8-bit Arcade In.ttf');
}

@font-face {
  font-family: "dogica";
  src: url('./assets/fonts/dogica/TTF/dogica.ttf');
}

.pixelify {
  font-family: 'Pixelify Sans', sans-serif;
}
</style>