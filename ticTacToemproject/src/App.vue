<script setup lang="ts">
import { ref, type Ref } from 'vue';
import LeftPanel from './components/LeftPanel.vue'
import RightPanel from './components/RightPanel.vue'
import StartScreen from './components/StartScreen.vue'
import AISelectionPanel from './components/AISelectionPanel.vue'
import MainScreen from './components/MainScreen.vue'
import GraphPanel from './components/GraphPanel.vue'
import { useDisplay } from 'vuetify'
import { getGuiState, type GuiState } from './logic/GuiState';

const guiState: Ref<GuiState> = getGuiState()
const mobile = useDisplay().smAndDown

const window = ref(0)
const length = ref(2)
</script>

<template>
  <main>
    <v-container v-show="guiState === 'start'">
      <v-window
        v-model="window"
        show-arrows
      >
      <template v-slot:next="{ props }">
        <v-btn @click="props.onClick">
          Zu den KIs >
        </v-btn>
      </template>
        <v-window-item>
          <v-container>
            <StartScreen/>
          </v-container>
        </v-window-item>
        <v-window-item>
          <AISelectionPanel />
        </v-window-item>
      </v-window>
    </v-container>

    <v-container v-show="guiState !== 'start'">
      <v-window
        v-model="window"
        show-arrows
      >
        <v-window-item>
          <v-container>
            <MainScreen/>
          </v-container>
        </v-window-item>
        <v-window-item>
          <GraphPanel />
        </v-window-item>
      </v-window>
    </v-container>
  </main>
</template>

<style>
html {
  background-color: black;
}

body {
  font-family: 'Pixelify Sans', sans-serif;
}

.bigarcade {
  font-family: "8_big_arcade";
}

.dogica {
  font-family: "dogica";
}

.pixelify {
  font-family: 'Pixelify Sans', sans-serif;
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
</style>