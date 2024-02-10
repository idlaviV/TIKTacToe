<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import StartScreen from './components/StartScreen.vue'
import AISelectionPanel from './components/AISelectionPanel.vue'
import MainScreen from './components/MainScreen.vue'
import GraphPanel from './components/GraphPanel.vue'
import { useDisplay } from 'vuetify'
import { getGuiState, type GuiState, useDigitalFont } from './logic/GuiState';
import SettingsPopover from './components/SettingsPopover.vue';
import { watch } from 'vue';
import type _default from 'v-network-graph/lib/components/VNetworkGraph.vue.js';

const guiState: Ref<GuiState> = getGuiState()
const mobile = useDisplay().smAndDown

const window = ref(0)

function setFont() {
  if (useDigitalFont.value) {
    document.body.style.fontFamily = "Pixelify Sans"
  } else {
    document.body.style.fontFamily = ""
  }
}
setFont()

watch(useDigitalFont, setFont)
</script>

<template>
  <main>
    <v-container v-show="guiState === 'start'">
      <v-window v-model="window">
        <v-layout>
          <v-bottom-navigation
            v-model="window"
            class="bg-black"
            color=white
            horizontal
            grow
          >
            <v-btn>
              <v-icon>mdi-nintendo-game-boy</v-icon>
              Spiel
            </v-btn>

            <v-btn>
              <v-icon>mdi-robot</v-icon>
              KIs
            </v-btn>

            <v-btn>
              <v-icon>mdi-wrench</v-icon>
              Einstellungen
            </v-btn>
          </v-bottom-navigation>
        </v-layout>
        <v-window-item>
          <v-container>
            <StartScreen/>
          </v-container>
        </v-window-item>
        <v-window-item>
          <AISelectionPanel />
        </v-window-item>
        <v-window-item>
          <SettingsPopover />
        </v-window-item>
      </v-window>
    </v-container>

    <v-container v-show="guiState !== 'start'">
      <v-window v-if="mobile" v-model="window">
        <v-layout>
          <v-bottom-navigation
            v-model="window"
            class="bg-black"
            color=white
            horizontal
            grow
          >
            <v-btn>
              <v-icon>mdi-nintendo-game-boy</v-icon>
              Spiel
            </v-btn>

            <v-btn>
              <v-icon>mdi-graph</v-icon>
              Graph
            </v-btn>

            <v-btn>
              <v-icon>mdi-wrench</v-icon>
              Einstellungen
            </v-btn>
          </v-bottom-navigation>
        </v-layout>
        <v-window-item>
          <v-container>
            <MainScreen/>
          </v-container>
        </v-window-item>
        <v-window-item>
          <GraphPanel />
        </v-window-item>
        <v-window-item>
          <SettingsPopover />
        </v-window-item>
      </v-window>
      
      <v-window v-else="!mobile" v-model="window">
        <v-layout>
          <v-bottom-navigation
            v-model="window"
            class="bg-black"
            color=white
            horizontal
            grow
          >
            <v-btn>
              <div>
                <v-icon class="mx-1">mdi-nintendo-game-boy</v-icon>
                <v-icon class="mx-1">mdi-graph</v-icon>
              </div>
              Spiel und Graph
            </v-btn>

            <v-btn>
              <v-icon>mdi-wrench</v-icon>
              Einstellungen
            </v-btn>
          </v-bottom-navigation>
        </v-layout>
        <v-window-item>
          <v-container>
            <v-row>
              <v-col cols="4">
                <v-container><MainScreen/></v-container>
              </v-col>
              <v-col>
                <v-container><GraphPanel/></v-container>
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>
        <v-window-item>
          <SettingsPopover />
        </v-window-item>
      </v-window>
    </v-container>
  </main>
</template>

<style>
html {
  background-color: black;
}

.v-btn {
  border-radius: 0px!important;
}

.v-card {
  border-radius: 0px!important;
}

.v-overlay {
  border-radius: 0px!important;
}

.bigarcade {
  font-family: "8_big_arcade";
}

.dogica {
  font-family: "dogica";
}

.tictactoe {
  font-size: 49px;
}

.disable-events {
  pointer-events: none
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