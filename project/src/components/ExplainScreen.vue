<script setup lang="ts">
import { VNetworkGraph, VEdgeLabel } from 'v-network-graph'
import { useDigitalFont } from '@/logic/GuiState'
import GraphPanelNode from './GraphPanelNode.vue'
import { configsExplainGraph } from '@/components/GraphPanelUserConfigs'
import {
  explainNodes,
  explainLabels,
  explainEdges,
  explainLayouts
} from '@/utils/ExplainScreenData'
</script>
<template>
  <v-card class="text-left ma-4 pa-4">
    <v-card-title class="text-center">Was ist das hier?</v-card-title>
    <v-divider />
    <br />
    <v-row>
      <v-col cols="12" md="7" lg="8" class="text-lg">
        <p>
          Dies ist eine Umsetzung des klassischen Spiels Tic Tac Toe in einer Webanwendung. Du
          kannst gegen einen Freund oder gegen eine KI spielen.
        </p>
        <br />
        <p>
          Die KI speichert für jeden möglichen Zug eine Zahl. Je größer die Zahl, desto
          wahrscheinlicher ist es, dass die KI diesen Zug ausführt. Zum Beispiel wird die KI in der
          angezeigten Situation den rechten Zug doppelt so wahrscheinlich ausführen als den
          mittleren Zug. Nach jedem Spiel analysiert die KI die gespielten Züge und passt diese
          Zahlen an.
        </p>
        <br />
        <p>
          Es gibt drei verschiedene Arten von KIs zur Auswahl. Jede von ihnen lernt unterschiedlich.
          Zu Beginn ist die KI sehr schlecht, aber sie wird mit der Zeit lernen, wenn du sie
          trainierst. Du kannst entweder selbst gegen eine KI spielen oder KIs gegeneinander
          trainieren lassen.
        </p>
        <br />
        <p>Viel Erfolg!</p>
      </v-col>
      <v-col cols="12" md="5" lg="4" align="center">
        <div>
          <v-network-graph
            ref="graph"
            class="explainGraph"
            :nodes="explainNodes"
            :edges="explainEdges"
            :layouts="explainLayouts"
            :configs="configsExplainGraph"
          >
            <template #edge-label="{ edgeId, ...slotProps }">
              <v-edge-label
                :class="`${useDigitalFont === true ? 'dogica text-s' : 'text-xl'}`"
                vertical-align="above"
                :text="explainLabels[edgeId]"
                v-bind="slotProps"
              />
            </template>
            <template #override-node="{ nodeId }">
              <GraphPanelNode :state="explainNodes[nodeId].boardState" />
            </template>
          </v-network-graph></div
      ></v-col>
    </v-row>
  </v-card>
</template>

<style>
.explainGraph {
  width: 100%;
  max-width: 400px;
  height: 400px;
  border: 1px solid #38373d;
}
</style>
