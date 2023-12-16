<script setup lang="ts">
import {  type Nodes, type Edges, VNetworkGraph } from "v-network-graph"
import GraphPanelNodeField from "./GraphPanelNodeField.vue"

const props = defineProps<{nodes:Nodes, edges:Edges}>()


</script>

<template>
  <v-network-graph
    ref="graph"
    class="graph"
    :nodes="props.nodes"
    :edges="props.edges">

    <template #override-node="{ nodeId }">

      <GraphPanelNodeField :x="0" :y="0" :boardState="props.nodes[nodeId].boardState"/>
      <GraphPanelNodeField :x="1" :y="0" :boardState="props.nodes[nodeId].boardState"/>
      <GraphPanelNodeField :x="2" :y="0" :boardState="props.nodes[nodeId].boardState"/>
      <GraphPanelNodeField :x="0" :y="1" :boardState="props.nodes[nodeId].boardState"/>
      <GraphPanelNodeField :x="1" :y="1" :boardState="props.nodes[nodeId].boardState"/>
      <GraphPanelNodeField :x="2" :y="1" :boardState="props.nodes[nodeId].boardState"/>
      <GraphPanelNodeField :x="0" :y="2" :boardState="props.nodes[nodeId].boardState"/>
      <GraphPanelNodeField :x="1" :y="2" :boardState="props.nodes[nodeId].boardState"/>
      <GraphPanelNodeField :x="2" :y="2" :boardState="props.nodes[nodeId].boardState"/>
    </template>
  </v-network-graph>

  Hallo

</template>
