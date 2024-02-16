<script setup lang="ts">
import { VNetworkGraph, VEdgeLabel, type VNetworkGraphInstance } from 'v-network-graph'
import GraphPanelNode from './GraphPanelNode.vue'
import {
  currentGraphType,
  graphPanelUserConfigs,
  isPlayer2Graph,
  setCurrentGraphType
} from '@/components/GraphPanelUserConfigs'
import { graphExport } from '@/utils/GraphExport'
import { getGuiState, registerCleaningTaskPreStart, useDigitalFont } from '@/logic/GuiState'
import { computed, ref } from 'vue'
import { getLabelToShow } from '@/utils/LabelExport'
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

const graphType = computed(() => {
  const guiState = getGuiState().value
  const handler = GameHandler.getInstance()
  if (guiState === 'game') {
    setCurrentGraphType('gameGraph')
  } else if (guiState === 'evaluation' || guiState === 'postevaluation') {
    if (handler.getNumberOfAIs() === 2) {
      isPlayer2Graph.value
        ? setCurrentGraphType('player2Graph')
        : setCurrentGraphType('player1Graph')
    } else if (handler.getNumberOfAIs() === 1) {
      handler.getSettings().getPlayer(1).isAI()
        ? setCurrentGraphType('player1Graph')
        : setCurrentGraphType('player2Graph')
    }
  }
  return currentGraphType
})

const graph = ref<VNetworkGraphInstance>()

const resetPan = () => {
  const size = graph.value?.getSizes()
  if (size !== undefined && size.width !== 0 && size.height !== 0) {
    graph.value?.panTo({ x: 0, y: 0 })
    const x = size?.width! / 2
    const y = size?.height! / 2
    graph.value?.panBy({ x: x, y: y })
  }
}

registerCleaningTaskPreStart(resetPan)

const config = graphPanelUserConfigs
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
        (getGuiState().value === 'evaluation' || getGuiState().value === 'postevaluation') &&
        GameHandler.getInstance().getNumberOfAIs() === 2
      "
      id="labelSwitch"
    >
      <v-switch v-model="isPlayer2Graph" label="Wechsle KI"></v-switch>
    </div>
    <div id="resetPan">
      <v-btn
        icon="mdi-image-filter-center-focus-weak"
        size="x-small"
        class="mx-2"
        variant="outlined"
        v-on:click="resetPan()"
      ></v-btn>
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

#resetPan {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}

.graph {
  width: 100%;
  height: 100%;
  border: 1px solid #38373d;
  height: 81vh;
}
</style>
