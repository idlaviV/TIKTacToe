<script setup lang="ts">
import {
  type Nodes,
  type Edges,
  VNetworkGraph,
  type Layouts,
  defineConfigs,
  type VNetworkGraphInstance,
  type UserConfigs
} from 'v-network-graph'
import GraphPanelNodeField from './GraphPanelNodeField.vue'
import { ref, watch, type Ref } from 'vue'
import { layout } from '../utils/useGraphLayout'
import { GameHandler } from '@/logic/GameHandler'

const gameHandler: GameHandler = GameHandler.getInstance()
const range = [0, 1, 2]
gameHandler.getHistoryWithChildsExport().initialize()
const nodes: Ref<Nodes> = gameHandler.getHistoryWithChildsExport().getNodes()
const edges: Ref<Edges> = gameHandler.getHistoryWithChildsExport().getEdges()

const layouts: Ref<Layouts> = ref({
  nodes: {
    //'0': { x: 20, y: 20 } //Fixes root to 20|20, the calculated position by dagre
  }
})

const graph = ref<VNetworkGraphInstance>()

function updateLayout() {
  const activeNode = layout(nodes.value, edges.value, layouts.value)
  const height = graph.value?.getSizes().height
  const width = graph.value?.getSizes().width
  if (activeNode !== undefined && height !== undefined && width !== undefined) {
    const x = layouts.value.nodes[activeNode].x
    const y = layouts.value.nodes[activeNode].y
    graph.value?.panTo({ x: -x, y: -y }) //Moves to the current node
    graph.value?.panBy({ x: width / 2 - 20, y: height / 2 + 20 }) // Move current node to center
  }
}

const configs: UserConfigs = defineConfigs({
  view: {
    panEnabled: true,
    zoomEnabled: false,
    scalingObjects: true,
    autoPanAndZoomOnLoad: 'center-zero',
    autoPanOnResize: false,
    onBeforeInitialDisplay: updateLayout
  },
  node: {
    selectable: false,
    draggable: false,
    normal: {
      type: 'rect',
      borderRadius: 0,
      width: 65,
      height: 65
    },
    label: {
      visible: false
    }
  },
  edge: {
    normal: {
      color: '#aaa',
      width: 2
    },
    margin: 4,
    marker: {
      target: {
        type: 'arrow',
        width: 4,
        height: 4
      }
    }
  }
})

watch(nodes.value, updateLayout)
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
      <template v-for="x in range">
        <GraphPanelNodeField
          v-for="y in range"
          :key="x + '|' + y"
          :x="x"
          :y="y"
          :fieldType="nodes[nodeId].boardState[y][x]"
        />
      </template>
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
