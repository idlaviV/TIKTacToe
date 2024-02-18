<script setup lang="ts">
import { TTTEdge, TTTNode, type TTTNodes } from '@/utils/Graph';
import { VNetworkGraph, VEdgeLabel } from 'v-network-graph'
import { useDigitalFont } from '@/logic/GuiState'
import GraphPanelNode from './GraphPanelNode.vue'
import * as gc from '@/components/GraphConstants'
import { configsExplainGraph } from '@/components/GraphPanelUserConfigs'


const nodes : TTTNodes = {
    0: new TTTNode(0, [[0,0,0],[0,0,0],[0,0,0]], 0, false),
    1: new TTTNode(1, [[1,0,0],[0,0,0],[0,0,0]], 1, false),
    10: new TTTNode(10, [[0,1,0],[0,0,0],[0,0,0]], 1, false),
    10000: new TTTNode(10000, [[0,0,0],[0,1,0],[0,0,0]], 1, false),
}
const edges ={
    '0#1' : new TTTEdge('0', '1', '0#1', 0, 0, 1),
    '0#10' : new TTTEdge('0', '10', '0#10', 0, 0, 10),
    '0#10000' : new TTTEdge('0', '10000', '0#10000', 0, 0, 10000)
}
const labels : Record<string, string>={
    '0#1': '0',
    '0#10': '1',
    '0#10000': '2'
}
const layouts = {
    nodes: {
        0: { x: 0, y: 0 },
        1: { x: -3*gc.nodeSize, y: 3*gc.nodeSize},
        10: { x:0, y:3*gc.nodeSize},
        10000: {x:3*gc.nodeSize, y:3*gc.nodeSize}
    }
}

</script>
<template>
    <v-expansion-panels>
    <v-expansion-panel>
        <v-expansion-panel-title class="text-xl">
            <p class="text-2xl">Was ist das hier?</p>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
        <v-row>
            <v-col cols="6" class="text-lg">
        <p>
            Dies ist eine Umsetzung des klassischen Spiels Tic Tac Toe in einer Webanwendung.
            Du kannst gegen einen Freund oder gegen eine KI spielen.
            
        </p>
        <p>
        Die KI speichert für jeden möglichen Zug eine Zahl.
        Je größer die Zahl, desto wahrscheinlicher ist es, dass die KI diesen Zug ausführt.
        Zum Beispiel wird die KI in der Situation oben den rechten Zug doppelt so wahrscheinlich ausführen als den mittleren Zug.
        Nach jedem Spiel analysiert die KI die gespielten Züge und passt diese Zahlen an.
    </p>
    <p>
        Es gibt drei verschiedene Arten von KIs zur Auswahl. Jede von ihnen lernt unterschiedlich.
    </p>
</v-col>
<v-col>
        <div>
      <v-network-graph
        ref="graph"
        id="graph"
        class="graph"
        :nodes="nodes"
        :edges="edges"
        :layouts="layouts"
        :configs="configsExplainGraph"
      >
      <template #edge-label="{ edgeId, ...slotProps }">
          <v-edge-label
            :class="`${useDigitalFont === true ? 'dogica text-s' : 'text-xl'}`"
            vertical-align="above"
            :text="labels[edgeId]"
            v-bind="slotProps"
          />
        </template>
        <template #override-node="{ nodeId }">
          <GraphPanelNode :state="nodes[nodeId].boardState" />
        </template>
    </v-network-graph></div></v-col>
    
    </v-row>
    </v-expansion-panel-text>
    </v-expansion-panel>
    </v-expansion-panels>
</template>