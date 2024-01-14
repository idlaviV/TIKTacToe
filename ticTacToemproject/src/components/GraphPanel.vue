<script setup lang="ts">
import {
  type Nodes,
  type Edges,
  VNetworkGraph,
  type Layouts,
  type VNetworkGraphInstance
} from 'v-network-graph'
import GraphPanelNode from './GraphPanelNode.vue'
import { ref, watch, type Ref } from 'vue'
import { layout } from '../utils/useGraphLayout'
import { GameHandler } from '@/logic/GameHandler'
import { configs } from '@/components/GraphPanelUserConfigs'

const gameHandler: GameHandler = GameHandler.getInstance()

const nodes: Ref<Nodes> = gameHandler.getHistoryExport().getNodes()
const edges: Ref<Edges> = gameHandler.getHistoryExport().getEdges()

const layouts: Ref<Layouts> = ref({
  nodes: {
    //'0': { x: 20, y: 20 } //Fixes root to 20|20, the calculated position by dagre
  }
})

if (configs.view) {
  configs.view.onBeforeInitialDisplay = updateLayout
}
watch(nodes.value, updateLayout)

const graph = ref<VNetworkGraphInstance>()

function updateLayout() {
  const activeNode = layout(nodes.value, edges.value, layouts.value)
  const height = graph.value?.getSizes().height
  const width = graph.value?.getSizes().width
  if (activeNode !== undefined && height !== undefined && width !== undefined) {
    const x = layouts.value.nodes[activeNode].x
    const y = layouts.value.nodes[activeNode].y
    graph.value?.panTo({ x: x, y: -y }) //Moves to the current node
    graph.value?.panBy({ x: width / 2 - 20, y: height / 2 + 20 }) // Move current node to center
  }
}
</script>

<template>
  <v-network-graph
    ref="graph"
    class="graph"
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :configs="configs"
  >
    <template #override-node="{ nodeId }">
      <GraphPanelNode :node-id="nodeId" :nodes="nodes" />
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
