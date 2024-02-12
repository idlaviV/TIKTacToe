<script setup lang="ts">
import {
  VNetworkGraph,
  VEdgeLabel,
  type VNetworkGraphInstance,
  type UserConfigs
} from 'v-network-graph'
import GraphPanelNode from './GraphPanelNode.vue'
import { currentGraphType, initializeConfig } from '@/components/GraphPanelUserConfigs'
import { graphExport } from '@/utils/GraphExport'
import { getGuiState, useDigitalFont } from '@/logic/GuiState'
import { computed, ref, watch } from 'vue'
import { getLabelToShow } from '@/utils/LabelExport'
import * as Layout from '@/utils/useGraphLayout'
import { guiDisable } from '@/logic/GuiState'
import { GameHandler } from '@/logic/GameHandler'

const handler = GameHandler.getInstance()
const layouts = Layout.layouts
const nodesForDisplay = computed(() => {
  if (guiDisable.value === 'standard') {
    return graphExport.value.nodes
  } else {
    return {}
  }
})
const edgesForDisplay = computed(() => {
  return graphExport.value.edges
})
const graphType = computed(() => {
  return currentGraphType
})
const graph = ref<VNetworkGraphInstance>()
const isPlayer2Graph = ref<boolean>(false)
const config = ref<UserConfigs>(initializeConfig('simpleGraph'))

watch(getGuiState(), (guiState) => {
  if (guiState === 'game') {
    config.value = initializeConfig('gameGraph')
  } else if (guiState === 'evaluation' || guiState ==='postevaluation') {
    if (handler.getNumberOfAIs() === 2) {
      config.value = isPlayer2Graph.value
        ? initializeConfig('player2Graph')
        : initializeConfig('player1Graph')
    } else if (handler.getNumberOfAIs() === 1) {
      config.value = handler.getSettings().getPlayer(1).isAI()
        ? initializeConfig('player1Graph')
        : initializeConfig('player2Graph')
    }
  }
})
watch(isPlayer2Graph, (value) => {
  if ((getGuiState().value === 'evaluation' || getGuiState().value === 'postevaluation') && handler.getNumberOfAIs() === 2) {
    config.value = value ? initializeConfig('player2Graph') : initializeConfig('player1Graph')
  }
})
</script>

<!-- The GraphPanel contains the visualization of the game history and the next possible moves. -->
<template>
  <div class="graphPanel">
    <v-network-graph
      ref="graph"
      id="graph"
      class="graph"
      :nodes="nodesForDisplay"
      :edges="edgesForDisplay"
      :layouts="layouts"
      :configs="config"
    >
      <template #edge-label="{ edgeId, ...slotProps }">
        <v-edge-label
          :class="`${useDigitalFont === true ? 'dogica text-s' : 'text-xl'}`"
          vertical-align="above"
          :text="getLabelToShow(edgeId, graphType.value)"
          v-bind="slotProps"
        />
      </template>
      <template #override-node="{ nodeId }">
        <GraphPanelNode :node="graphExport.nodes[nodeId]" />
      </template>
    </v-network-graph>
    <div
      v-if="
        (getGuiState().value === 'evaluation' || getGuiState().value === 'postevaluation') && GameHandler.getInstance().getNumberOfAIs() === 2
      "
      id="labelSwitch"
    >
      <v-switch v-model="isPlayer2Graph" label="Wechsle KI"></v-switch>
    </div>
  </div>
</template>

<style>
.graphPanel {
  position: relative;
}

#labelSwitch {
  position: absolute;
  top: 0;
  left: 20px;
  z-index: 10;
}

.graph {
  width: 100%;
  height: 100%;
  border: 1px solid #38373d;
  height: 81vh;
}
</style>
