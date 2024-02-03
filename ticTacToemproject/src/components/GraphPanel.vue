<script setup lang="ts">
import { VNetworkGraph, VEdgeLabel, type VNetworkGraphInstance } from 'v-network-graph'
import GraphPanelNode from './GraphPanelNode.vue'
import { configs } from '@/components/GraphPanelUserConfigs'
import { graphExport } from '@/utils/GraphExport'
import { computed, ref } from 'vue'
import { labelExport } from '@/utils/LabelExport'
import * as Layout from '@/utils/useGraphLayout'
import { guiDisable } from '@/logic/GuiState'

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
      :configs="configs"
    >
      <template #edge-label="{ edgeId, ...slotProps }">
        <v-edge-label vertical-align="above" :text="labelExport[edgeId][1]" v-bind="slotProps" />
      </template>
      <template #override-node="{ nodeId }">
        <GraphPanelNode :node="graphExport.nodes[nodeId]" />
      </template>
    </v-network-graph>
    <div id="labelSwitch">
      <v-switch label="Wechsle KI"></v-switch>
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
