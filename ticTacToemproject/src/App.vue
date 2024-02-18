<script setup lang="ts">
import { ref, type Ref } from 'vue'
import StartScreen from './components/StartScreen.vue'
import AISelectionPanel from './components/AISelectionPanel.vue'
import MainScreen from './components/MainScreen.vue'
import GraphPanel from './components/GraphPanel.vue'
import { getGuiState, type GuiState } from './logic/GuiState'
import SettingsPanel from './components/SettingsPanel.vue'

const guiState: Ref<GuiState> = getGuiState()
const window = ref(0)

document.body.style.fontFamily = 'Pixelify Sans'

</script>

<template>
  <main>
    <v-container v-show="guiState === 'start'">
      <v-window :touch="{left: undefined, right: undefined}" v-model="window">
        <v-layout>
          <v-bottom-navigation
            v-model="window"
            class="bg-black"
            color="white"
            horizontal
            grow
            mandatory
          >
            <v-btn value="0">
              <v-icon>mdi-nintendo-game-boy</v-icon>
              Spiel
            </v-btn>

            <v-btn value="1">
              <v-icon>mdi-robot</v-icon>
              KIs
            </v-btn>

            <v-btn value="2">
              <v-icon>mdi-wrench</v-icon>
              Einstellungen
            </v-btn>
          </v-bottom-navigation>
        </v-layout>
        <v-window-item value="0">
          <v-container>
            <StartScreen />
          </v-container>
        </v-window-item>
        <v-window-item value="1">
          <AISelectionPanel />
        </v-window-item>
        <v-window-item value="2">
          <SettingsPanel />
        </v-window-item>
      </v-window>
    </v-container>

    <v-container v-show="guiState !== 'start'">
      <v-window :touch="{left: undefined, right: undefined}" v-model="window">
        <v-layout>
          <v-bottom-navigation
            v-model="window"
            class="bg-black"
            color="white"
            horizontal
            grow
            mandatory
          >
            <v-btn value="0">
              <div>
                <v-icon class="mx-1">mdi-nintendo-game-boy</v-icon>
                <v-icon class="mx-1">mdi-graph</v-icon>
              </div>
              Spiel und Graph
            </v-btn>

            <v-btn value="2">
              <v-icon>mdi-wrench</v-icon>
              Einstellungen
            </v-btn>
          </v-bottom-navigation>
        </v-layout>
        <v-window-item value="0">
          <v-container>
            <v-row>
              <v-col cols="12" md="5" lg="4">
                <v-container><MainScreen /></v-container>
              </v-col>
              <v-col cols="12" md="7" lg="8">
                <v-container><GraphPanel /></v-container>
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>
        <v-window-item value="2">
          <SettingsPanel />
        </v-window-item>
      </v-window>
    </v-container>
    <v-card height="50px" class="bg-black"></v-card>
  </main>
</template>

<style>
html, body {
  overflow: hidden;
  overscroll-behavior:none;
}

@media screen and (pointer: coarse) {
  @supports (-webkit-backdrop-filter: blur(1px)) and (overscroll-behavior-y: none)  {
    html {
      min-height: 100.1%;
      overscroll-behavior-y: none;
    }
  }
}
</style>
