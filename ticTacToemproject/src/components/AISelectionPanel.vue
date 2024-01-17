<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import { players } from '@/utils/PlayerListExport'
import { ref } from 'vue'

const aIs = players

/**
 * Remove the human player from the list of players
 */
const getAIs: () => { player: string; index: number }[] = () => {
  return aIs.value.filter((ai) => ai.index !== 0)
}
/**
 * All possible AI options
 * @todo aiOptions should be pulled from backend somehow?
 */
const aiOptions = [
  { title: 'Elimination', index: 0 },
  { title: 'Random', index: 1 }
]
/**
 * Model for the selected AI option
 */
const selectedAIOption = ref(0)
/**
 * Model for the name of the new AI
 */
const aiName = ref('New AI')
</script>

<!-- The AISelectionPanel contains a list of all existing AIs and the option to create new AIs,
---- given a name and an AI type.
-->
<template>
  <div>
    <v-card class="mx-auto" max-width="700">
      <v-card-title>AISelectionPanel</v-card-title>
      <v-virtual-scroll :items="getAIs()" height="220">
        <template v-slot:default="{ item }">
          <v-list-item :title="item.player">
            <template v-slot:prepend>
              <i class="material-symbols-outlined"> smart_toy </i>
            </template>
            <template v-slot:append>
              <v-btn>Reset</v-btn>
            </template>
          </v-list-item>
        </template>
      </v-virtual-scroll>
      <v-divider></v-divider>
      <v-card-title>Neue KI erzeugen</v-card-title>
      <v-select
        label="Choose AI type"
        v-model="selectedAIOption"
        :items="aiOptions"
        item-title="title"
        item-value="index"
      />
      <v-text-field v-model="aiName" label="Choose name" />
      <v-btn v-on:click="GameHandler.getInstance().createAI(selectedAIOption, aiName)">
        Create AI
      </v-btn>
    </v-card>
  </div>
</template>
