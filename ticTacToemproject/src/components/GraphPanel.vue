<script setup lang="ts">
import { VNetworkGraph, type Layouts, type VNetworkGraphInstance } from 'v-network-graph'
import GraphPanelNode from './GraphPanelNode.vue'
import { ref, watch, type Ref } from 'vue'
import { layout } from '../utils/useGraphLayout'
import { configs } from '@/components/GraphPanelUserConfigs'
import { graphExport } from '@/utils/GraphExport'
import { computed } from 'vue'
import { GameHandler } from '@/logic/GameHandler'

/**
 * @description The position of the nodes in the graph.
 */
const layouts: Ref<Layouts> = ref({
  nodes: {
    //'0': { x: 20, y: 20 } //Fixes root to 20|20, the calculated position by dagre
  }
})

/**
 * Update the layout after setup and after every move.
 */
if (configs.view) {
  configs.view.onBeforeInitialDisplay = updateLayout
}

const nodesForDisplay = computed(() => {
  return graphExport.value.nodes
})

const edgesForDisplay = computed(() => {
  return graphExport.value.edges
})
const graph = ref<VNetworkGraphInstance>()

watch(GameHandler.getInstance().getPlayerOnTurn(), updateLayout)

/**
 * Calculate new node positions and pan to the active node.
 */
function updateLayout() {
  const activeNode = layout(graphExport.value.nodes, graphExport.value.edges, layouts.value)
  const height = graph.value?.getSizes().height
  const width = graph.value?.getSizes().width
  if (activeNode !== undefined && height !== undefined && width !== undefined) {
    const x = layouts.value.nodes[activeNode].x
    const y = layouts.value.nodes[activeNode].y
    graph.value?.panTo({ x: -x, y: -y }) //Moves to the current node
    graph.value?.panBy({ x: width / 2 - 20, y: height / 2 + 20 }) // Move current node to center
  }
}
</script>

<!-- The GraphPanel contains the visualization of the game history and the next possible moves. -->
<template>
  <v-network-graph
    ref="graph"
    class="graph"
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
  height: 600px;
  border: 1px solid #000;
}
</style>
