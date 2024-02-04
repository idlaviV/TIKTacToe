<script setup lang="ts">
import {
  VNetworkGraph,
  VEdgeLabel,
  type VNetworkGraphInstance,
  type UserConfigs
} from 'v-network-graph'
import GraphPanelNode from './GraphPanelNode.vue'
import {
  simpleGraphConfigs,
  gameGraphConfigs,
  player1GraphConfigs,
  player2GraphConfigs
} from '@/components/GraphPanelUserConfigs'
import { graphExport } from '@/utils/GraphExport'
import { getGuiState } from '@/logic/GuiState'
import { computed, ref, watch } from 'vue'
import { labelExport } from '@/utils/LabelExport'
import * as Layout from '@/utils/useGraphLayout'
import { guiDisable } from '@/logic/GuiState'
import { GameHandler } from '@/logic/GameHandler'

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
const graph = ref<VNetworkGraphInstance>()
const isPlayer2Graph = ref<boolean>(false)
const config = ref<UserConfigs>(simpleGraphConfigs)
const test = ref<number>(0)

watch(getGuiState(), (guiState) => {
  const handler = GameHandler.getInstance()
  if (guiState === 'game') {
    config.value = gameGraphConfigs
  } else if (guiState === 'evaluation') {
    if (handler.getNumberOfAIs() === 2) {
      config.value = isPlayer2Graph.value ? player2GraphConfigs : player1GraphConfigs
    } else if (handler.getNumberOfAIs() === 1) {
      config.value = handler.getSettings().getPlayer(1).isAI()
        ? player1GraphConfigs
        : player2GraphConfigs
    }
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
        <v-edge-label vertical-align="above" :text="labelExport[edgeId][test]" v-bind="slotProps" />
      </template>
      <template #override-node="{ nodeId }">
        <GraphPanelNode :node="graphExport.nodes[nodeId]" />
      </template>
    </v-network-graph>
    <div
      v-if="
        getGuiState().value === 'evaluation' && GameHandler.getInstance().getNumberOfAIs() === 2
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

#graph {
  position: absolute;
  top: 0;
  left: 0;
}

.graph {
  width: 100%;
  height: 100%;
  border: 1px solid #38373d;
  height: 90vh;
}
</style>
