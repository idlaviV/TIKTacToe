<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler';
import * as GraphBuilder from '@/logic/GraphBuilder';
import {type Ref, computed, ref } from 'vue';
import { configs } from '@/components/GraphPanelUserConfigs'
import { VNetworkGraph, VEdgeLabel, type VNetworkGraphInstance, type Nodes } from 'v-network-graph'
import GraphPanelNode from './GraphPanelNode.vue'
import {layout} from '@/utils/useGraphLayout'
import { TTTNode, type TTTNodes } from '@/utils/GraphExport';

    const props = defineProps<{ aiIndex:number }>()

    const weightGraph = computed(()=>(GameHandler.getInstance().getAIWeightsGraph(props.aiIndex)))
     
    //const layouts : Ref<Layouts> = ref({nodes: {}})
    const graphAI = ref<VNetworkGraphInstance>()
    //layout(nodes.value, edges.value, layouts)
</script>
<template>
    <v-network-graph
    ref="graphAI"
    class="graph full-height"
    :nodes="weightGraph.nodes"
    :edges="weightGraph.edges"
    :configs="configs"
  >
    <!--
    <template #edge-label="{ edgeId, ...slotProps }">
      <v-edge-label :text="labelExport[edgeId][1]" v-bind="slotProps" />
    </template>-->
    <template #override-node="{ nodeId }">
      <GraphPanelNode :node="weightGraph.nodes[nodeId]" />
    </template>
  </v-network-graph>
</template>