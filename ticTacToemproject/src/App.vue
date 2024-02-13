<script setup lang="ts">
import { ref, type Ref } from 'vue'
import StartScreen from './components/StartScreen.vue'
import AISelectionPanel from './components/AISelectionPanel.vue'
import MainScreen from './components/MainScreen.vue'
import GraphPanel from './components/GraphPanel.vue'
import { getGuiState, type GuiState, useDigitalFont } from './logic/GuiState'
import SettingsPanel from './components/SettingsPanel.vue'
import { watch } from 'vue'
import { useDisplay } from 'vuetify'

const guiState: Ref<GuiState> = getGuiState()
const window = ref(0)
const mobile = useDisplay().smAndDown

function setFont() {
  if (useDigitalFont.value) {
    document.body.style.fontFamily = 'Pixelify Sans'
  } else {
    document.body.style.fontFamily = ''
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
          <v-bottom-navigation v-model="window" class="bg-black" color="white" horizontal grow>
            <v-btn :class="`${window === 0 ? 'disable-events' : ''}`">
              <v-icon>mdi-nintendo-game-boy</v-icon>
              Spiel
            </v-btn>

            <v-btn :class="`${window === 1 ? 'disable-events' : ''}`">
              <v-icon>mdi-robot</v-icon>
              KIs
            </v-btn>

            <v-btn :class="`${window === 2 ? 'disable-events' : ''}`">
              <v-icon>mdi-wrench</v-icon>
              Einstellungen
            </v-btn>
          </v-bottom-navigation>
        </v-layout>
        <v-window-item>
          <v-container>
            <StartScreen />
          </v-container>
        </v-window-item>
        <v-window-item>
          <AISelectionPanel />
        </v-window-item>
        <v-window-item>
          <SettingsPanel />
        </v-window-item>
      </v-window>
    </v-container>

    <v-container v-show="guiState !== 'start'">
      <v-window v-if="mobile" v-model="window">
        <v-layout>
          <v-bottom-navigation v-model="window" class="bg-black" color="white" horizontal grow>
            <v-btn :class="`${window === 0 ? 'disable-events' : ''}`">
              <v-icon>mdi-nintendo-game-boy</v-icon>
              Spiel
            </v-btn>

            <v-btn :class="`${window === 1 ? 'disable-events' : ''}`">
              <v-icon>mdi-graph</v-icon>
              Graph
            </v-btn>

            <v-btn :class="`${window === 2 ? 'disable-events' : ''}`">
              <v-icon>mdi-wrench</v-icon>
              Einstellungen
            </v-btn>
          </v-bottom-navigation>
        </v-layout>
        <v-window-item>
          <v-container>
            <MainScreen />
          </v-container>
        </v-window-item>
        <v-window-item>
          <GraphPanel />
        </v-window-item>
        <v-window-item>
          <SettingsPanel />
        </v-window-item>
      </v-window>

      <v-window v-else v-model="window">
        <v-layout>
          <v-bottom-navigation v-model="window" class="bg-black" color="white" horizontal grow>
            <v-btn :class="`${window === 0 ? 'disable-events' : ''}`">
              <div>
                <v-icon class="mx-1">mdi-nintendo-game-boy</v-icon>
                <v-icon class="mx-1">mdi-graph</v-icon>
              </div>
              Spiel und Graph
            </v-btn>

            <v-btn :class="`${window === 1 ? 'disable-events' : ''}`">
              <v-icon>mdi-wrench</v-icon>
              Einstellungen
            </v-btn>
          </v-bottom-navigation>
        </v-layout>
        <v-window-item>
          <v-container>
            <v-row>
              <v-col cols="4">
                <v-container><MainScreen /></v-container>
              </v-col>
              <v-col>
                <v-container><GraphPanel /></v-container>
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>
        <v-window-item>
          <SettingsPanel />
        </v-window-item>
      </v-window>
    </v-container>
    <v-card height="50px" class="bg-black"></v-card>
  </main>
</template>

<style>
.disable-events {
  pointer-events: none;
}
</style>
