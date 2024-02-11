<script setup lang="ts">
import { AIPlayer } from '@/logic/AIPlayer'
import { BackpropagationPolicy } from '@/logic/BackpropagationPolicy'
import { GameHandler } from '@/logic/GameHandler'
import { players } from '@/utils/PlayerListExport'
import { computed, ref } from 'vue'

const aIs = players
const areAISettingsShown = ref(false)
const aIPlayer = ref<AIPlayer>()
const winDiff = ref<number>()
const drawDiff = ref<number>()
const loseDiff = ref<number>()

/**
 * Remove the human player from the list of players
 */
const getAIs = computed(() => {
  return aIs.value.filter((ai) => ai.index !== 0)
})

/**
 * All possible AI options
 * @todo aiOptions should be pulled from backend somehow?
 */
const aiOptions = [
  { title: 'Elimination', index: 0 },
  { title: 'Fehlerrückführung', index: 1 },
  { title: 'Elimination v2.0', index: 2 }
]
/**
 * Model for the selected AI option
 */
const selectedAIOption = ref(0)
/**
 * Model for the name of the new AI
 */
const aiName = ref('Neue KI')

const resetAiWeights: (index: number) => void = (index: number) => {
  GameHandler.getInstance().resetAiWeights(index)
}

function showSettingsOfAI(playerName: string) {
  areAISettingsShown.value = true
  const possiblePlayers = GameHandler.getInstance().getPossiblePlayers()
  aIPlayer.value = possiblePlayers.find((player) => {
    return player.getName() === playerName
  })! as AIPlayer
  winDiff.value = (aIPlayer.value.policy as BackpropagationPolicy).winDiff
  drawDiff.value = (aIPlayer.value.policy as BackpropagationPolicy).drawDiff
  loseDiff.value = (aIPlayer.value.policy as BackpropagationPolicy).loseDiff
}

function saveSettings() {
  ;(aIPlayer.value!.policy as BackpropagationPolicy).setDiffs(
    Number(winDiff.value),
    Number(drawDiff.value),
    Number(loseDiff.value)
  )
}

const drawer = ref(true)
const rail = ref(true)
</script>

<!-- The AISelectionPanel contains a list of all existing AIs and the option to create new AIs,
---- given a name and an AI type.
-->
<template>
  <v-card class="mx-auto" variant="outlined" max-width="500">
    <v-card-title>KI-Übersichtsfenster</v-card-title>
    <v-overlay v-model="areAISettingsShown" class="justify-center">
      <v-card class="pa-4 ma-4">
        <v-card-title class="text-center">{{ aIPlayer!.getName() }}</v-card-title>
        <div class="text-left">Spiele: {{ aIPlayer!.getStats().games }}</div>
        <div class="text-left">Gewonnen: {{ aIPlayer!.getStats().wins }}</div>
        <div class="text-left">Unentschieden: {{ aIPlayer!.getStats().draws }}</div>
        <div class="text-left">Verloren: {{ aIPlayer!.getStats().losses }}</div>

        <div v-if="aIPlayer!.policy instanceof BackpropagationPolicy">
          <br />
          <v-divider></v-divider>
          <br />
          <div class="text-center font-bold">Wie soll belohnt werden?</div>
          <br />
          <v-text-field v-model="winDiff" label="Bei Gewinn" />
          <v-text-field v-model="drawDiff" label="Bei Unentschieden" />
          <v-text-field v-model="loseDiff" label="Bei Verlieren" />
          <v-col class="text-center">
            <v-btn class="bg-white" v-on:click="saveSettings()"> Speichern </v-btn>
          </v-col>
        </div>
        <v-col class="text-center">
          <v-btn variant="outlined" color="red" v-on:click="areAISettingsShown = false"
            >Schließen</v-btn
          >
        </v-col>
      </v-card>
    </v-overlay>
    <v-virtual-scroll :items="getAIs" height="220">
      <template v-slot:default="{ item }">
        <v-list-item :title="item.player">
          <template v-slot:prepend>
            <i class="material-symbols-outlined mx-2"> smart_toy </i>
          </template>
          <template v-slot:append>
            <v-btn
              v-on:click="showSettingsOfAI(item.player)"
              size="x-small"
              class="mx-2"
              icon="mdi-magnify"
              variant="outlined"
            ></v-btn>
            &nbsp;
            <v-btn variant="outlined" v-on:click="resetAiWeights(item.index)">RESET</v-btn>
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
    <v-divider class="border-opacity-100"></v-divider>
    <v-card-title>Neue KI erzeugen</v-card-title>
    <v-card class="bg-black my-2 mx-2">
      <v-select
        label="Wähle einen KI-Typ"
        v-model="selectedAIOption"
        :items="aiOptions"
        item-title="title"
        item-value="index"
      />
      <v-text-field v-model="aiName" label="Wähle einen Namen für die KI" />
      <v-btn
        class="bg-white"
        v-on:click="GameHandler.getInstance().createAI(selectedAIOption, aiName)"
      >
        Erstelle eine neue KI
      </v-btn>
    </v-card>
  </v-card>
</template>
