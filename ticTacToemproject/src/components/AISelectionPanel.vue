<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import { players } from '@/utils/PlayerListExport'
import { computed, ref } from 'vue'

const aIs = players

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
  { title: 'Fehlerrückführung', index: 1 }
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
</script>

<!-- The AISelectionPanel contains a list of all existing AIs and the option to create new AIs,
---- given a name and an AI type.
-->
<template>
  <div>
    <v-card class="mx-auto" max-width="700">
      <v-card-title>KI-Übersichtsfenster</v-card-title>
      <v-virtual-scroll :items="getAIs" height="220">
        <template v-slot:default="{ item }">
          <v-list-item :title="item.player">
            <template v-slot:prepend>
              <i class="material-symbols-outlined mx-2"> smart_toy </i>
            </template>
            <template v-slot:append>
              <v-btn v-on:click="resetAiWeights(item.index)">Zurücksetzen</v-btn>
            </template>
          </v-list-item>
        </template>
      </v-virtual-scroll>
      <v-divider></v-divider>
      <v-card-title>Neue KI erzeugen</v-card-title>
      <v-select
        label="Wähle einen KI-Typ"
        v-model="selectedAIOption"
        :items="aiOptions"
        item-title="title"
        item-value="index"
      />
      <v-text-field v-model="aiName" label="Wähle einen Namen für die KI" />
      <v-btn v-on:click="GameHandler.getInstance().createAI(selectedAIOption, aiName)">
        Erstelle eine neue KI
      </v-btn>
    </v-card>
  </div>
</template>
