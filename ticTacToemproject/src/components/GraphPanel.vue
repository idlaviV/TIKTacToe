<script setup lang="ts">
import {  type Nodes, type Edges, VNetworkGraph } from "v-network-graph"
import { reactive, ref } from "vue";


const nodeSize = 40

const props = defineProps<{nodes:Nodes, edges:Edges}>()



</script>

<template>

  <v-network-graph
    :nodes="props.nodes"
    :edges="props.edges">

    <template #override-node="{ nodeId }">
      <rect x=-30 y=-30 width="20" height="20" style="fill-opacity:0;stroke-width:0.5;stroke:white" />
      <rect x=-10 y=-30 width="20" height="20" style="fill-opacity:0;stroke-width:0.5;stroke:white" />
      <rect x=10 y=-30 width="20" height="20" style="fill-opacity:0;stroke-width:0.5;stroke:white" />
      <rect x=-30 y=-10 width="20" height="20" style="fill-opacity:0;stroke-width:0.5;stroke:white" />
      <rect x=-10 y=-10 width="20" height="20" style="fill-opacity:0;stroke-width:0.5;stroke:white" />
      <rect x=10 y=-10 width="20" height="20" style="fill-opacity:0;stroke-width:0.5;stroke:white" />
      <rect x=-30 y=10 width="20" height="20" style="fill-opacity:0;stroke-width:0.5;stroke:white" />
      <rect x=-10 y=10 width="20" height="20" style="fill-opacity:0;stroke-width:0.5;stroke:white" />
      <rect x=10 y=10 width="20" height="20" style="fill-opacity:0;stroke-width:0.5;stroke:white" />
      <text text-anchor="middle" x="10" y="20" style="fill:white;">
        <tspan x="-20" y="-15">{{ props.nodes[nodeId].boardState[0][0] }}</tspan>
        <tspan x="0" y="-15" >{{ props.nodes[nodeId].boardState[0][1] }}</tspan>
        <tspan x="20" y="-15" >{{ props.nodes[nodeId].boardState[0][2] }}</tspan>
        <tspan x="-20" y="5" >{{ props.nodes[nodeId].boardState[1][0] }}</tspan>
        <tspan x="0" y="5" >{{ props.nodes[nodeId].boardState[1][1] }}</tspan>
        <tspan x="20" y="5" >{{ props.nodes[nodeId].boardState[1][2] }}</tspan>
        <tspan x="-20" y="25" >{{ props.nodes[nodeId].boardState[2][0] }}</tspan>
        <tspan x="0" y="25" >{{ props.nodes[nodeId].boardState[2][1] }}</tspan>
        <tspan x="20" y="25" >{{ props.nodes[nodeId].boardState[2][2] }}</tspan>
      </text>
    </template>
  </v-network-graph>

  Hallo

</template>
