<script setup lang="ts">
import { VNetworkGraph, type VNetworkGraphInstance } from 'v-network-graph'
import GraphPanelNode from './GraphPanelNode.vue'
import { configs } from '@/components/GraphPanelUserConfigs'
import { graphExport } from '@/utils/GraphExport'
import { computed, ref } from 'vue'
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
  <v-network-graph
    ref="graph"
    class="graph full-height"
    :nodes="nodesForDisplay"
    :edges="edgesForDisplay"
    :layouts="layouts"
    :configs="configs"
  >
    <template #override-node="{ nodeId }">
      <GraphPanelNode :node="graphExport.nodes[nodeId]" />
    </template>
  </v-network-graph>
</template>

<style>
.graph {
  width: 100%;
  height: 100%;
  border: 1px solid #000;
}

.full-height {
  height: 90vh;
}
</style>
