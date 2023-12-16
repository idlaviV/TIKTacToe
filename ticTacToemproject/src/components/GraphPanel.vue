<script setup lang="ts">
import { type Nodes, type Edges, VNetworkGraph, type Layouts, defineConfigs } from 'v-network-graph'
import GraphPanelNodeField from './GraphPanelNodeField.vue'
import { watch } from 'vue'
import { layout } from '../utils/useGraphLayout'

const props = defineProps<{ nodes: Nodes; edges: Edges }>()
const range = [0, 1, 2]
const nodes: Nodes = props.nodes
const edges: Edges = props.edges

const layouts: Layouts = { nodes: {} }

function updateLayout() {
  layout(nodes, edges, layouts)
}

const configs = defineConfigs({
  view: {
    panEnabled: true, //false,
    zoomEnabled: true, //false,
    scalingObjects: true,
    autoPanAndZoomOnLoad: 'fit-content',
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

watch(nodes, updateLayout)
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

  Hallo
</template>

<style>
.graph {
  width: 100%;
  height: 600px;
  border: 1px solid #000;
}
</style>
