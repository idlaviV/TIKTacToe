<script setup lang="ts">
import { players } from '@/utils/PlayerListExport'
import { VNetworkGraph, type VNetworkGraphInstance } from 'v-network-graph'
import { configs } from '@/components/GraphPanelUserConfigs'
import { getBigGraph } from '@/logic/ConfigurationGraph';
import type { Graph } from '@/utils/Graph';
import GraphPanelNode from './GraphPanelNode.vue'
import { ref } from 'vue';


    defineProps<{
        aiWeightsSelection: number
    }>()

    const graphExport = getBigGraph()
    const graph = ref<VNetworkGraphInstance>()

</script>
<template>
    <div>
        {{players[aiWeightsSelection].player}}
        <v-network-graph
            ref="graph"
            class="graph full-height"
            :nodes="graphExport.nodes"
            :edges="graphExport.edges"
            :configs="configs"
        >
        <!--<template #override-node="{ nodeId }">
        <GraphPanelNode :node="graphExport.nodes[nodeId]" />
        </template>-->
    
    </v-network-graph>

    </div>
</template>