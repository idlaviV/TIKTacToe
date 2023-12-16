<script setup lang="ts">
import {  type Nodes, type Edges, VNetworkGraph } from "v-network-graph"
import GraphPanelNodeField from "./GraphPanelNodeField.vue"

const props = defineProps<{nodes:Nodes, edges:Edges}>()
const range = [0,1,2]

</script>

<template>
  <v-network-graph
    ref="graph"
    class="graph"
    :nodes="props.nodes"
    :edges="props.edges">

    <template #override-node="{ nodeId }">
      <template v-for = "x in range">
        <GraphPanelNodeField 
          v-for = "y in range"
          :key="x+ '|' + y"
          :x="x" 
          :y="y" 
          :fieldType="props.nodes[nodeId].boardState[y][x]"
        />
      </template>
    </template>
  </v-network-graph>

  Hallo

</template>
