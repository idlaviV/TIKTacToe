<script setup lang="ts">
import { players } from '@/utils/PlayerListExport'
import { VNetworkGraph, type VNetworkGraphInstance } from 'v-network-graph'
import { configs } from '@/components/GraphPanelUserConfigs'
import { getBigGraph,bigLayout } from '@/logic/ConfigurationGraph';
import type { Graph } from '@/utils/Graph';
import GraphPanelNode from './GraphPanelNode.vue'
import { ref } from 'vue';
import { computed } from 'vue';


    defineProps<{
        aiWeightsSelection: number
    }>()

    const graphExport  = getBigGraph()
    const nodes = computed(() => {
        return getBigGraph().nodes
    })
    const graph = ref<VNetworkGraphInstance>()

</script>
<template>
    <div>
        {{players[aiWeightsSelection].player}}
        <v-network-graph
            ref="graph"
            class="graph full-height"
            :nodes="nodes"
            :edges="graphExport.edges"
            :configs="configs"
            :layouts="bigLayout"
        >
        <template #override-node="{ nodeId }">
        <GraphPanelNode :node="graphExport.nodes[nodeId]" />
        </template>
    
    </v-network-graph>

    </div>
</template>